# 古怪玩具屋 · 千万别按！

第一次做网页，做了一间能互动的红蓝像素玩具屋。

**试玩：https://maple-xin.github.io/odd-toy-house/**

按下红按钮触发全屋连锁反应。40秒内回收至少8颗胶囊，并逮住逃跑的弹簧怪物。

- 拖动胶囊到黄色回收口，或移动挡板把胶囊引导进去。
- 点击怪物进行抓捕；点击陀螺暂停旋风4秒。
- 支持暂停、重新开始、音效开关及手机触摸操作。
- 成功与失败会出现不同结局，可以下载纪念卡。
- 键盘：M抓怪物，C选择胶囊，B选择挡板，方向键移动，Enter放下。

## 本地运行

这是无需构建的静态网站。使用HTTP服务器打开，不要直接双击HTML文件（Three.js模块需要HTTP）。

```sh
python -m http.server 8080
```

打开 http://localhost:8080 。

## 文件

- `index.html`、`game.css`：页面、HUD、弹窗和响应式布局。
- `game.js`：输入、碰撞、计时、回收与结局。
- `scene-motion.js`：环境与事件动画。
- `toy-animation.js`：像素玩具分层动画。
- `top-3d.js`：Three.js旋转陀螺。
- 图片、字体和Three.js模块同样存放在根目录，使用相对路径。

## 发布

GitHub仓库 Settings → Pages，选择 Deploy from a branch → main → /(root)，保存。更新main分支后Pages会自动重新发布。

## 素材与依赖

玩具图为本项目生成的原创素材。Three.js使用MIT许可，Press Start 2P字体使用SIL Open Font License，许可文本为根目录的 `THREE-MIT.txt` 和 `PressStart2P-OFL.txt`。本仓库没有为项目自有代码和图片额外授予开源许可。
