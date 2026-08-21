import {
  Frame,
  FRAME_ALIGN_BOTTOM,
  FRAME_ALIGN_LEFT_TOP,
  FRAME_ALIGN_RIGHT_BOTTOM,
  MapPlayer,
  Timer,
} from "@eiriksgata/wc3ts/*";
import { FrameEventUtils } from "src/constants/frame/utils";
import { UIBackgrounds } from "src/constants/ui/preset";
import {
  type Buff,
  BUFF_EVENT_BUFFS_CHANGED,
  BuffPolarity,
  buildBuffTooltipText,
  formatSlotTimeShort,
  registerDefaultBuffDisplays,
  resolveBuffDisplay,
} from "src/system/buff";
import { Actor } from "../../actor";
import { eventBus } from "../../event/EventBus";
import { gameEvents } from "../../event";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { Tips, TipsAnimation, TipsPosition } from "./Tips";
import { createLogger } from "src/utils/logger";

const log = createLogger("BuffBarUI");

const REFRESH_INTERVAL = 0.1;
let nextBuffSlotNameId = 1;

/** 槽位时间角标用字体（与 UnitBlood 一致，地图内已有资源） */
const SLOT_TIME_FONT = "resource\\Texture\\ui\\hpbar\\ZiTi.TTf";

export interface BuffBarLayoutConfig {
  slotsPerRow: number;
  maxRows: number;
  /** 默认可由 slotsPerRow * maxRows 推导；单独设置时可限制总格数 */
  maxSlots?: number;
  iconSizePx: number;
  borderPadPx: number;
  spacingPx: number;
  rowSpacingPx: number;
  rowPaddingPx: number;
  /** 相对屏幕几何中心的额外偏移（像素，右下为正） */
  centerOffsetXPx: number;
  centerOffsetYPx: number;
}

export const DEFAULT_BUFF_BAR_LAYOUT: BuffBarLayoutConfig = {
  slotsPerRow: 10,
  maxRows: 3,
  iconSizePx: 36,
  borderPadPx: 2,
  spacingPx: 4,
  rowSpacingPx: 4,
  rowPaddingPx: 4,
  centerOffsetXPx: 0,
  centerOffsetYPx: 0,
};

interface SlotFrames {
  border: Frame;
  icon: Frame;
  timeText: Frame;
  hit: Frame;
  buffId: number;
}

function buffTipsTextColor(buff: Buff): string {
  switch (buff.polarity) {
    case BuffPolarity.BENEFICIAL:
      return "A8FFA8";
    case BuffPolarity.NEGATIVE:
      return "FF8888";
    case BuffPolarity.NEUTRAL:
      return "CCCCCC";
    default:
      return "FFFFFF";
  }
}

/**
 * 屏幕居中 Buff 图标网格（紧凑、悬停 Tips、槽位显示剩余时间）
 */
export class BuffBarUI {
  private static instance: BuffBarUI | undefined;

  private layout: BuffBarLayoutConfig = { ...DEFAULT_BUFF_BAR_LAYOUT };
  private gameUI: Frame | null = null;
  private watchTarget: Actor | undefined;
  private slots: SlotFrames[] = [];
  private subscriptionId: number = -1;
  private refreshTimer: Timer | null = null;
  private created = false;

  private static followSelectionBound = false;

  private constructor() {}

  public static getInstance(): BuffBarUI {
    if (!BuffBarUI.instance) {
      BuffBarUI.instance = new BuffBarUI();
    }
    return BuffBarUI.instance;
  }

  private getMaxSlots(): number {
    const cap = this.layout.slotsPerRow * this.layout.maxRows;
    if (this.layout.maxSlots !== undefined) {
      return math.min(this.layout.maxSlots, cap);
    }
    return cap;
  }

  public setLayout(config: Partial<BuffBarLayoutConfig>): this {
    this.layout = { ...this.layout, ...config };
    if (this.created && this.watchTarget) {
      this.rebuildSlots();
    }
    return this;
  }

  public getLayout(): BuffBarLayoutConfig {
    return { ...this.layout };
  }

  public create(): void {
    if (this.created) return;
    registerDefaultBuffDisplays();

    const gui = Frame.fromHandle(DzGetGameUI());
    this.gameUI = gui ?? null;
    if (!this.gameUI) {
      log.error("DzGetGameUI failed");
      return;
    }

    this.subscriptionId = eventBus.on(
      BUFF_EVENT_BUFFS_CHANGED,
      (payload: { actor: Actor }) => {
        if (this.watchTarget && payload.actor.id === this.watchTarget.id) {
          this.rebuildSlots();
        }
      }
    );

    this.refreshTimer = Timer.create();
    this.refreshTimer.start(REFRESH_INTERVAL, true, () => {
      this.refreshTimeLabels();
    });

    this.created = true;
  }

  public bindFollowLocalSelection(): void {
    if (BuffBarUI.followSelectionBound) return;
    BuffBarUI.followSelectionBound = true;

    gameEvents.onUnitSelected((data) => {
      if (GetTriggerPlayer() !== GetLocalPlayer()) return;
      BuffBarUI.getInstance().setWatchTarget(data.Actor);
    });
    gameEvents.onUnitDeselected(() => {
      if (GetTriggerPlayer() !== GetLocalPlayer()) return;
      BuffBarUI.getInstance().setWatchTarget(undefined);
    });
  }

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
    if (this.refreshTimer) {
      this.refreshTimer.destroy();
      this.refreshTimer = null;
    }
    this.clearSlots();
    this.watchTarget = undefined;
    this.created = false;
    this.gameUI = null;
    BuffBarUI.instance = undefined;
  }

  private clearSlots(): void {
    for (const s of this.slots) {
      s.hit.destroy();
      s.timeText.destroy();
      s.icon.destroy();
      s.border.destroy();
    }
    this.slots = [];
  }

  private refreshTimeLabels(): void {
    if (!this.created || !this.gameUI || !this.watchTarget) return;
    if (this.watchTarget.owner !== MapPlayer.fromLocal()) return;

    const buffs = this.watchTarget.buffManager.getBuffs();
    const n = math.min(buffs.length, this.getMaxSlots());
    if (this.slots.length !== n) {
      this.rebuildSlots();
      return;
    }
    for (let i = 0; i < n; i++) {
      const slot = this.slots[i];
      const b = buffs[i];
      if (!slot || b.id !== slot.buffId) {
        this.rebuildSlots();
        return;
      }
      slot.timeText.setText(formatSlotTimeShort(b));
    }
  }

  private rebuildSlots(): void {
    this.clearSlots();
    if (!this.gameUI || !this.watchTarget) return;
    if (this.watchTarget.owner !== MapPlayer.fromLocal()) return;

    const buffs = this.watchTarget.buffManager.getBuffs();
    const n = math.min(buffs.length, this.getMaxSlots());

    const {
      slotsPerRow,
      iconSizePx,
      borderPadPx,
      spacingPx,
      rowSpacingPx,
      rowPaddingPx,
      centerOffsetXPx,
      centerOffsetYPx,
    } = this.layout;

    const slotOuter = iconSizePx + borderPadPx * 2;
    const cols = slotsPerRow;
    const rows = this.layout.maxRows;
    const gridWidthPx =
      cols * slotOuter + (cols - 1) * spacingPx + 2 * rowPaddingPx;
    const gridHeightPx =
      rows * slotOuter + (rows - 1) * rowSpacingPx + 2 * rowPaddingPx;
    const anchorLeft =
      (ScreenCoordinates.STANDARD_WIDTH - gridWidthPx) / 2 +
      centerOffsetXPx;
    const anchorTop =
      (ScreenCoordinates.STANDARD_HEIGHT - gridHeightPx) / 2 +
      centerOffsetYPx;

    const padX =
      (borderPadPx / ScreenCoordinates.STANDARD_WIDTH) *
      ScreenCoordinates.WC3_SCREEN_WIDTH;
    const padY =
      (borderPadPx / ScreenCoordinates.STANDARD_HEIGHT) *
      ScreenCoordinates.WC3_SCREEN_HEIGHT;
    const wc3Icon = ScreenCoordinates.pixelSizeToWC3(iconSizePx, iconSizePx);
    const timeH = 14;
    const wc3Time = ScreenCoordinates.pixelSizeToWC3(slotOuter, timeH);

    for (let i = 0; i < n; i++) {
      const buff = buffs[i];
      const def = resolveBuffDisplay(buff);
      const row = math.floor(i / slotsPerRow);
      const col = i % slotsPerRow;

      const slotLeft =
        anchorLeft + rowPaddingPx + col * (slotOuter + spacingPx);
      const slotTop =
        anchorTop + rowPaddingPx + row * (slotOuter + rowSpacingPx);

      const wc3Outer = ScreenCoordinates.pixelSizeToWC3(slotOuter, slotOuter);
      const wc3Pos = ScreenCoordinates.pixelToWC3(
        slotLeft,
        slotTop,
        ScreenCoordinates.ORIGIN_TOP_LEFT
      );
      const rightX = wc3Pos.x + wc3Outer.width;
      const bottomY = wc3Pos.y - wc3Outer.height;

      const nameId = nextBuffSlotNameId++;
      const border = Frame.createType(
        `BuffSlotBorder_${nameId}_${i}`,
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
      DzFrameSetPriority(border.handle, 898);

      const icon = Frame.createType(
        `BuffSlotIcon_${nameId}_${i}`,
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

      const timeText = Frame.createType(
        `BuffSlotTime_${nameId}_${i}`,
        border,
        0,
        "TEXT",
        ""
      )!;
      timeText
        .setPoint(FRAME_ALIGN_BOTTOM, border, FRAME_ALIGN_BOTTOM, 0, 0.003)
        .setSize(wc3Time.width, wc3Time.height)
        .setText(formatSlotTimeShort(buff));
      timeText.setTextAlignment(4, 0);
      timeText.setFont(SLOT_TIME_FONT, 0.008, 0);

      const hit = Frame.createType(
        `BuffSlotHit_${nameId}_${i}`,
        border,
        0,
        "BUTTON",
        ""
      )!;
      hit.setAllPoints(border);
      DzFrameSetPriority(hit.handle, 899);

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
              text: buildBuffTooltipText(buff),
              textColor: buffTipsTextColor(buff),
              icon: def.icon,
              width: 300,
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

      this.slots.push({
        border,
        icon,
        timeText,
        hit,
        buffId: buff.id,
      });
    }
  }
}
