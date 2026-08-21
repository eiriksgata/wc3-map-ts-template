---
name: wc3-blp-convert
description: >-
  Convert JPG/PNG images to Warcraft III 1.27a BLP1 via yarn convert:blp.
  Use when the user asks to convert textures, icons, or UI art to .blp,
  mentions png/jpg/jpeg to blp, 贴图格式, 图标导入, or adding custom map textures
  from 图片素材/.
---

# WC3 BLP1 转换

本仓库目标客户端是 **Warcraft III 1.27a**。游戏贴图只认 **BLP1** 和 **TGA**，不认 PNG/JPG，也不认魔兽世界的 **BLP2/DXT**。

需要把 JPG/PNG 变成可贴进地图的 `.blp` 时，**只跑** `yarn convert:blp`。不要另写转换器，也不要用会默认产出 BLP2 的库（例如 `@pinta365/blp` 的 `encodeToBLP`）。

## 命令

```
yarn convert:blp <input> [output] [options]
```

常用：

```
yarn convert:blp 图片素材/白泽UI/技能/移动.jpg
yarn convert:blp icon.png --import Texture/ui/icon.blp --size 64
yarn convert:blp 图片素材/白泽UI/技能 -r --import Texture/ui/skills
yarn convert:blp foo.png --out maps/resource/Texture/ui/foo.blp --format palette
```

| 选项 | 作用 |
|------|------|
| `--import <mpqPath>` | 写到 `maps/resource/<mpqPath>`，并在 `maps/table/imp.ini` 追加 MPQ 路径 |
| `-r` | 递归处理目录里的 `.jpg/.jpeg/.png` |
| `--format auto\|palette\|jpeg` | 默认 `auto`：有透明→调色板 BLP1，否则 JPEG BLP1 |
| `--size 64` 或 `--size 256x64` | 强制尺寸（命令按钮常用 64x64） |
| `--keep-size` | 不拉到 2 的幂 |
| `--quality 1-100` | JPEG 质量，默认 85 |
| `--no-mipmaps` | 只写 mip 0 |
| `--dry-run` | 只打印计划 |

实现：`scripts/convert-blp.ts` + `scripts/lib/blp1.ts`。写出后文件头必须是 `BLP1`。

## Agent 工作流

1. 确认源文件是 `.jpg/.jpeg/.png`，不要把 `图片素材/` 里的原图路径直接写进 TS/FDF。
2. 这张图要进地图时用 `--import`，不要只转在素材目录旁再手工拷。
3. `--import` 写的是 **剥掉 `resource\` 之后的 MPQ 路径**（BLP 在 `maps/resource/` 下会被 w2l 剥前缀）。
   - 物理：`maps/resource/Texture/ui/skills/move.blp`
   - `--import Texture/ui/skills/move.blp`
   - 代码/FDF：`"Texture\\ui\\skills\\move.blp"`
4. 命令按钮：`--size 64`。大图/UI 面板：默认拉到 2 的幂即可。
5. 需要透明（PNG 图标、带 Alpha 的 UI）让 `auto` 走 palette，或显式 `--format palette`。照片/不透明贴图走 JPEG。
6. 落点与 `imp.ini` 细节以 `wc3-w3x2lni-workflow` 为准。转完后核对 `imp.ini` 里已有对应 `"Texture\\...\\x.blp"`。
7. 不要把转换挂进 `yarn build`；不要提交用户没要求导入的试转产物。

## 不要做的事

- 不要生成或导入 BLP2 / DXT。
- 不要假设 1.27a 能直接加载 PNG。
- 不要写 `"resource\\Texture\\...blp"`（BLP 会剥 `resource\`）。
- 不要用 `DzUnlockBlpSizeLimit` 当默认方案；默认仍输出 2 的幂。仅在用户明确要求原始尺寸时用 `--keep-size`。
