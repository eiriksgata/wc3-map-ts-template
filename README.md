# 魔兽争霸3 1.27a TypeScripts 开发 模板

该项目模板默认使用者具有 常规的技术使用，接触相关的编程知识。

该项目提供了 KKWE(包含X_JAPI) 、 w2l(w3x2lni) 环境

## 开发环境

1. KKWE
2. w3x2lni
3. node
4. yarn
5. War3 1.27a

## 项目初始化

`yarn install`
安装项目编译构建所需要的依赖

## 编译

`yarn build`
生成的 tstl lua 文件 自动放置于 maps/map/main.lua
编译 打包生成的 文件 位于 dist/map.w3x

## 运行测试

`yarn run test`
编译并且运行 dist/map.w3x 地图

## 目录结构

- `dev_lib` 开发环境库 包含KKWE 、w2l 
- `dist` 编译生成的文件 w3x 地图运行文件
- `maps` w2l lni 项目文件 如果需要 编写地形 可用 该目录下的 .w3x 载入到kkwe 编辑器中，编辑完成后保存 即可
- `scripts` 脚本文件
- `src` 地图源文件 ，入口文件为 `index.ts`
- `config.json` 配置环境目录
