# 智慧园区考勤日历配色通用扩展

这是一个本地 Chrome Manifest V3 扩展，只在以下地址运行：

`http://face.ict.ac.cn:4434/*`

## 浏览器支持

- Google Chrome：直接支持。
- Microsoft Edge：直接支持。
- Brave：直接支持。
- Opera：直接支持。
- Vivaldi：直接支持。
- Firefox：支持临时加载；长期安装需要经过 Mozilla 签名。
- Safari：源码兼容，需要使用 Safari 的临时扩展功能或 Apple 的 Web Extension 打包工具。

## 油猴安装

通用 ZIP 根目录中的 `attendance-calendar-color.user.js` 是油猴安装文件。先解压 ZIP，再打开该文件并确认安装即可。安装完成后，解压目录可以移动或删除。

## Chrome、Edge、Brave、Vivaldi 安装

1. 在 Chrome 地址栏打开 `chrome://extensions/`。
2. 打开页面右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择整个 `attendance-calendar-extension` 文件夹，不要只选择其中的文件。
5. 刷新考勤页面。

Edge、Brave 和 Vivaldi 的扩展管理页入口名称可能略有不同，但操作方式相同。

## Opera 安装

1. 打开 `opera:extensions`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择整个 `attendance-calendar-extension` 文件夹。
5. 刷新考勤页面。

## Firefox 临时安装

1. 打开 `about:debugging#/runtime/this-firefox`。
2. 点击“临时载入附加组件”。
3. 选择扩展文件夹中的 `manifest.json`，也可以选择扩展 ZIP。
4. 刷新考勤页面。

临时扩展会在 Firefox 重启后被移除。若需长期安装，扩展必须由 Mozilla 签名。

## Safari

当前源码可作为 Safari Web Extension 的输入。开发测试可在 Safari 的开发者设置中加载临时扩展；长期安装或分发需要使用 Apple 的 Web Extension 打包工具生成并签名 Safari 扩展。

## 更新

文件发生修改后，在浏览器的扩展管理页面找到本扩展并点击刷新按钮，然后刷新考勤页面。

## 说明

- 扩展只修改当前浏览器中的页面显示，不会修改服务器数据。
- `manifest.json` 是扩展清单。
- `content.js` 是自动注入考勤页面的脚本。
- 扩展版与油猴版使用相同逻辑；页面中带有重复加载保护。即使二者同时启用，也只会初始化一次，不会造成一次点击连续切换两种颜色。
