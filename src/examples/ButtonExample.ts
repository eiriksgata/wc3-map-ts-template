import { Button } from "src/system/ui/component/Button";
import { UIBackgrounds } from "src/constants/ui/preset";
import { createLogger } from "src/utils/logger";

const log = createLogger("ButtonExample");


/**
 * Button使用示例
 * 演示三层结构按钮的创建和使用
 */
export class ButtonExample {
  private testButton: Button | null = null;
  private centerButton: Button | null = null;

  public initialize(): void {
    log.info("初始化按钮示例");

    // 方法1: 使用像素坐标创建按钮
    this.testButton = new Button("测试按钮", 400, 300, 100, 36);

    // 配置按钮
    this.testButton
      .setTextColor("FFCC00") // 金色文字
      .setTexturePreset("BLACK_TRANSPARENT") // 使用预设背景
      .setOnClick(() => {
        log.info("测试按钮被点击了!");
      })
      .setOnHover(() => {
        log.info("鼠标进入测试按钮");
      })
      .setOnLeave(() => {
        log.info("鼠标离开测试按钮");
      })
      .addHoverEffect(); // 添加悬停透明度效果

    // 创建按钮(显示在界面上)
    this.testButton.create();

    // 方法2: 使用预设位置在屏幕中心创建按钮（推荐）
    this.centerButton = Button.createCentered("屏幕中心按钮", "LARGE");
    this.centerButton
      .setTextColor("00FF00") // 绿色文字
      .setBackground(UIBackgrounds.DIALOG) // 设置对话框背景
      .setOnClick(() => {
        log.info("中心按钮被点击!");
      });
    this.centerButton.create();

    log.info("按钮已创建");
  }

  public cleanup(): void {
    if (this.testButton) {
      this.testButton.destroy();
      this.testButton = null;
    }
    if (this.centerButton) {
      this.centerButton.destroy();
      this.centerButton = null;
    }
    log.info("清理完成");
  }
}
