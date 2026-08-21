import {
  Frame,
  FRAME_ALIGN_LEFT_TOP,
  FRAME_ALIGN_RIGHT_BOTTOM,
  MapPlayer,
} from "@eiriksgata/wc3ts/*";
import { FrameEventUtils } from "src/constants/frame/utils";
import { UIBackgrounds } from "src/constants/ui/preset";
import {
  RelicDefinition,
  RelicSystem,
  RELIC_EVENT_INVENTORY_CHANGED,
} from "src/system/relic";
import { Actor } from "../../actor";
import { eventBus } from "../../event/EventBus";
import { gameEvents } from "../../event";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { Tips, TipsAnimation, TipsPosition } from "./Tips";
import { createLogger } from "src/utils/logger";

const log = createLogger("RelicBarUI");
let nextRelicSlotNameId = 1;

/** 遗物栏布局（像素，左上角为原点） */
export interface RelicBarLayoutConfig {
  /** 相对屏幕左上角的 X 偏移 */
  anchorX: number;
  /** 相对屏幕左上角的 Y 偏移（下移增大） */
  anchorY: number;
  iconSizePx: number;
  /** 图标外圈深色底边宽度（像素） */
  borderPadPx: number;
  /** 遗物图标之间的间距 */
  spacingPx: number;
  /** 栏内侧留白 */
  rowPaddingPx: number;
  /** 最多显示图标数量 */
  maxIcons: number;
}

export const DEFAULT_RELIC_BAR_LAYOUT: RelicBarLayoutConfig = {
  anchorX: 120,
  anchorY: 30,
  iconSizePx: 48,
  borderPadPx: 3,
  spacingPx: 6,
  rowPaddingPx: 4,
  maxIcons: 24,
};

interface SlotFrames {
  border: Frame;
  icon: Frame;
  hit: Frame;
}

/** 与 TipsExample / 物品品质色接近，便于区分稀有度 */
function relicTipsTextColor(def: RelicDefinition): string {
  switch (def.rarity) {
    case "uncommon":
      return "1EFF00";
    case "rare":
      return "0070DD";
    case "boss":
      return "FFD700";
    default:
      return "FFFFFF";
  }
}

/**
 * 左上角横向遗物栏（杀戮尖塔式：小方块从左到右，悬停 Tips）
 */
export class RelicBarUI {
  private static instance: RelicBarUI | undefined;

  private layout: RelicBarLayoutConfig = { ...DEFAULT_RELIC_BAR_LAYOUT };
  private gameUI: Frame | null = null;
  private watchTarget: Actor | undefined;
  private slots: SlotFrames[] = [];
  private subscriptionId: number = -1;
  private created = false;

  /** 是否已注册「跟随本地选中」触发器（防重复注册） */
  private static followSelectionBound = false;

  private constructor() {}

  public static getInstance(): RelicBarUI {
    if (!RelicBarUI.instance) {
      RelicBarUI.instance = new RelicBarUI();
    }
    return RelicBarUI.instance;
  }

  public setLayout(config: Partial<RelicBarLayoutConfig>): this {
    this.layout = { ...this.layout, ...config };
    if (this.created && this.watchTarget) {
      this.rebuildSlots();
    }
    return this;
  }

  public getLayout(): RelicBarLayoutConfig {
    return { ...this.layout };
  }

  /**
   * 创建 UI 并订阅遗物库存变化（在 Frame.loadTOC 之后调用）
   */
  public create(): void {
    if (this.created) return;
    const gui = Frame.fromHandle(DzGetGameUI());
    this.gameUI = gui ?? null;
    if (!this.gameUI) {
      log.error("DzGetGameUI failed");
      return;
    }

    this.subscriptionId = eventBus.on(
      RELIC_EVENT_INVENTORY_CHANGED,
      (payload: { actor: Actor }) => {
        if (this.watchTarget && payload.actor.id === this.watchTarget.id) {
          this.rebuildSlots();
        }
      }
    );

    this.created = true;
  }

  /**
   * 本地玩家选中单位时，遗物栏自动显示该单位（若为其所有者）的遗物；取消选中时清空栏。
   * 遗物数据仍由 RelicSystem 按单位存储；本方法只负责把「当前选中」同步到 UI。
   * 重复调用无效（仅绑定一次）。
   */
  public bindFollowLocalSelection(): void {
    if (RelicBarUI.followSelectionBound) return;
    RelicBarUI.followSelectionBound = true;

    gameEvents.onUnitSelected((data) => {
      if (GetTriggerPlayer() !== GetLocalPlayer()) return;
      RelicBarUI.getInstance().setWatchTarget(data.Actor);
    });
    gameEvents.onUnitDeselected(() => {
      if (GetTriggerPlayer() !== GetLocalPlayer()) return;
      RelicBarUI.getInstance().setWatchTarget(undefined);
    });
  }

  /**
   * 仅当目标为本地玩家单位时显示；undefined 隐藏
   */
  public setWatchTarget(actor: Actor | undefined): void {
    this.watchTarget = actor;
    if (!actor || actor.owner !== MapPlayer.fromLocal()) {
      this.clearSlots();
      return;
    }
    this.rebuildSlots();
  }

  public getWatchTarget(): Actor | undefined {
    return this.watchTarget;
  }

  public destroy(): void {
    if (this.subscriptionId >= 0) {
      eventBus.off(this.subscriptionId);
      this.subscriptionId = -1;
    }
    this.clearSlots();
    this.watchTarget = undefined;
    this.created = false;
    this.gameUI = null;
    RelicBarUI.instance = undefined;
  }

  private clearSlots(): void {
    for (const s of this.slots) {
      s.hit.destroy();
      s.icon.destroy();
      s.border.destroy();
    }
    this.slots = [];
  }

  private rebuildSlots(): void {
    this.clearSlots();
    if (!this.gameUI || !this.watchTarget) return;
    if (this.watchTarget.owner !== MapPlayer.fromLocal()) return;

    const rs = RelicSystem.getInstance();
    const items = rs.getRelics(this.watchTarget);
    const n = math.min(items.length, this.layout.maxIcons);

    const {
      anchorX,
      anchorY,
      iconSizePx,
      borderPadPx,
      spacingPx,
      rowPaddingPx,
    } = this.layout;

    const slotOuter = iconSizePx + borderPadPx * 2;

    let slotIndex = 0;
    for (let i = 0; i < n; i++) {
      const item = items[i];
      const def = rs.getDefinition(item.id);
      if (!def) continue;

      const slotLeft =
        anchorX + rowPaddingPx + slotIndex * (slotOuter + spacingPx);
      const nameIdx = slotIndex;
      slotIndex++;
      const slotTop = anchorY + rowPaddingPx;

      const wc3Outer = ScreenCoordinates.pixelSizeToWC3(slotOuter, slotOuter);
      const wc3Pos = ScreenCoordinates.pixelToWC3(
        slotLeft,
        slotTop,
        ScreenCoordinates.ORIGIN_TOP_LEFT
      );
      const rightX = wc3Pos.x + wc3Outer.width;
      const bottomY = wc3Pos.y - wc3Outer.height;

      const nameId = nextRelicSlotNameId++;
      const border = Frame.createType(
        `RelicSlotBorder_${nameId}_${nameIdx}_${i}`,
        this.gameUI,
        0,
        "BACKDROP",
        ""
      )!;
      border
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
        .setTexture(UIBackgrounds.BLACK_TRANSPARENT, 0, true)
        .setAlpha(200);
      DzFrameSetPriority(border.handle, 900);

      const padX =
        (borderPadPx / ScreenCoordinates.STANDARD_WIDTH) *
        ScreenCoordinates.WC3_SCREEN_WIDTH;
      const padY =
        (borderPadPx / ScreenCoordinates.STANDARD_HEIGHT) *
        ScreenCoordinates.WC3_SCREEN_HEIGHT;
      const wc3Icon = ScreenCoordinates.pixelSizeToWC3(iconSizePx, iconSizePx);

      const icon = Frame.createType(
        `RelicSlotIcon_${nameId}_${i}`,
        border,
        0,
        "BACKDROP",
        ""
      )!;
      icon
        .setPoint(FRAME_ALIGN_LEFT_TOP, border, FRAME_ALIGN_LEFT_TOP, padX, -padY)
        .setSize(wc3Icon.width, wc3Icon.height)
        .setTexture(def.icon, 0, true)
        .setAlpha(255);

      const hit = Frame.createType(
        `RelicSlotHit_${nameId}_${i}`,
        border,
        0,
        "BUTTON",
        ""
      )!;
      hit.setAllPoints(border);
      DzFrameSetPriority(hit.handle, 901);

      const tips = Tips.getInstance();
      const componentInfo = {
        frame: hit,
        x: slotLeft,
        y: slotTop,
        width: slotOuter,
        height: slotOuter,
      };

      FrameEventUtils.bindEvents(hit, {
        onMouseEnter: () => {
          tips.showFromComponentInfo(
            {
              text: this.buildTipsText(def.name, def.description, item.stacks),
              textColor: relicTipsTextColor(def),
              icon: def.icon,
              width: 320,
              maxHeight: 360,
              position: TipsPosition.AUTO,
              animation: TipsAnimation.NONE,
              delayShow: 0,
            },
            componentInfo
          );
        },
        onMouseLeave: () => {
          tips.hide();
        },
      });

      this.slots.push({ border, icon, hit });
    }
  }

  /** 排版对齐 TipsExample（标题与正文空一行） */
  private buildTipsText(
    name: string,
    description: string,
    stacks: number
  ): string {
    let t = `${name}\n\n${description}`;
    if (stacks > 1) {
      t += `\n\n层数：${stacks}`;
    }
    return t;
  }
}
