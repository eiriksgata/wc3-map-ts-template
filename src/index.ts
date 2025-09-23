const ydConsole = require("jass.console")
ydConsole.enable = true;
_G["print"] = ydConsole.write;

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {
  //DisplayTextToPlayer(Player(0), 0, 0, "hello ts");

  print("hello ts");
}

// 启动应用程序
main();