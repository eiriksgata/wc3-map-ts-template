import { Tips, TipsAnimation, TipsPosition } from "src/system/ui/component/Tips";
import { Button } from "src/system/ui/component/Button";
import { createLogger } from "src/utils/logger";

const log = createLogger("TipsExample");


/**
 * Tips 组件使用示例
 */
export function runTipsExamples(): void {
  log.info("=== Tips 组件示例 ===");

  // 获取 Tips 单例
  const tips = Tips.getInstance();

  // 示例 1: 使用 getComponentInfo()（推荐方式）
  const skillButton = new Button("技能按钮", 200, 200, 100, 40);
  skillButton.create();
  skillButton.setText("火焰之球");

  skillButton.setOnHover(() => {
    log.info("显示技能提示 - 使用 getComponentInfo");
    const info = skillButton.getComponentInfo();
    tips.showFromComponentInfo({
      text: "火焰之球\n\n向目标发射一颗火球\n造成 150 点火焰伤害\n\n冷却时间: 10 秒\n魔法消耗: 100",
      textColor: "FFD700", // 金色
      icon: "ReplaceableTextures\\CommandButtons\\BTNFireBolt.blp",
      width: 320,
      maxHeight: 200,
      position: TipsPosition.AUTO,
      animation: TipsAnimation.NONE,
      delayShow: 0
    }, info);
  });

  skillButton.setOnLeave(() => {
    log.info("隐藏技能提示");
    tips.hide();
  });

  // 示例 2: 创建物品按钮
  // 示例 2: 直接传入 Frame（简化方式）
  const itemButton = new Button("物品按钮", 200, 260, 100, 40);
  itemButton.create();
  itemButton.setText("力量之冠");

  itemButton.setOnHover(() => {
    log.info("显示物品提示 - 直接使用 Frame");
    const info = itemButton.getComponentInfo();
    tips.show({
      text: "力量之冠\n\n+15 力量\n+8 护甲\n+200 生命值\n\n稀有度: 史诗\n\n一顶蕴含强大力量的王冠",
      textColor: "A335EE", // 紫色（史诗）
      icon: "ReplaceableTextures\\CommandButtons\\BTNCrown.blp",
      width: 300,
      position: TipsPosition.AUTO,
      animation: TipsAnimation.NONE,
      delayShow: 0
    }, info.x, info.y, info.width, info.height);
  });

  itemButton.setOnLeave(() => {
    tips.hide();
  });

  // 示例 3: 无动画提示（立即显示/隐藏）
  const infoButton = new Button("信息按钮", 200, 420, 100, 40);
  infoButton.create();
  infoButton.setText("帮助");

  infoButton.setOnHover(() => {
    log.info("显示帮助提示 - 无动画");
    const info = infoButton.getComponentInfo();
    tips.show({
      text: "点击查看详细帮助文档\n\n快捷键:\nF1 - 打开帮助\nF2 - 快速保存\nESC - 返回菜单",
      textColor: "00FFFF", // 青色
      width: 280,
      position: TipsPosition.AUTO,
      animation: TipsAnimation.NONE,  // 无动画，立即显示
      delayShow: 0  // 无延迟
    }, info.x, info.y, info.width, info.height);
  });

  infoButton.setOnLeave(() => {
    tips.hide();
  });

  // 示例 4: 不同位置的提示（使用滑动动画）
  const positions = [
    { name: "左上", x: 100, y: 100, pos: TipsPosition.AUTO, anim: TipsAnimation.SLIDE_RIGHT },
    { name: "右上", x: 1800, y: 100, pos: TipsPosition.AUTO, anim: TipsAnimation.SLIDE_LEFT },
    { name: "左下", x: 100, y: 1000, pos: TipsPosition.AUTO, anim: TipsAnimation.SLIDE_RIGHT },
    { name: "右下", x: 1800, y: 1000, pos: TipsPosition.AUTO, anim: TipsAnimation.SLIDE_LEFT },
  ];

  positions.forEach((item, index) => {
    const btn = new Button(`位置测试${index}`, item.x, item.y, 80, 30);
    btn.create();
    btn.setText(item.name);

    btn.setOnHover(() => {
      const info = btn.getComponentInfo();
      tips.show({
        text: `这是${item.name}的提示\n\n位置会自动调整\n以适应屏幕边界\n\n使用${item.anim === TipsAnimation.SLIDE_RIGHT ? '从左滑入' : '从右滑入'}动画`,
        textColor: "FFFFFF",
        width: 200,
        position: item.pos,
        animation: item.anim,
        delayShow: 0
      }, info.x, info.y, info.width, info.height);
    });

    btn.setOnLeave(() => {
      tips.hide();
    });
  });

  // 示例 5: 模拟技能栏
  log.info("创建技能栏示例");
  const skills = [
    {
      name: "雷霆一击",
      icon: "ReplaceableTextures\\CommandButtons\\BTNLightningBolt.blp",
      description: "召唤闪电攻击目标",
      damage: 200,
      cooldown: 8,
      mana: 120,
      color: "00FFFF"
    },
    {
      name: "烈焰风暴",
      icon: "ReplaceableTextures\\CommandButtons\\BTNInferno.blp",
      description: "在区域内造成持续伤害",
      damage: 80,
      cooldown: 15,
      mana: 200,
      color: "FF4500"
    },
    {
      name: "冰霜新星",
      icon: "ReplaceableTextures\\CommandButtons\\BTNFrostNova.blp",
      description: "冻结周围敌人",
      damage: 100,
      cooldown: 12,
      mana: 150,
      color: "87CEEB"
    },
    {
      name: "治疗之光",
      icon: "ReplaceableTextures\\CommandButtons\\BTNHeal.blp",
      description: "恢复友方单位生命值",
      damage: 0,
      cooldown: 6,
      mana: 80,
      color: "00FF00"
    }
  ];

  skills.forEach((skill, index) => {
    const skillBtn = new Button(`技能${index}`, 100 + index * 110, 900, 100, 100);
    skillBtn.create();
    skillBtn.setBackground(skill.icon);

    skillBtn.setOnHover(() => {
      let text = `${skill.name}\n\n${skill.description}\n\n`;
      if (skill.damage > 0) {
        text += `伤害: ${skill.damage}\n`;
      } else {
        text += `治疗量: 150\n`;
      }
      text += `冷却时间: ${skill.cooldown} 秒\n`;
      text += `魔法消耗: ${skill.mana}`;

      const info = skillBtn.getComponentInfo();
      tips.show({
        text,
        textColor: skill.color,
        icon: skill.icon,
        width: 300,
        position: TipsPosition.AUTO,
      }, info.x, info.y, info.width, info.height);
    });

    skillBtn.setOnLeave(() => {
      tips.hide();
    });
  });

  log.info("✓ Tips 示例创建完成");
}

