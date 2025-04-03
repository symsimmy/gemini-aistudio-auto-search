# AI Studio Helper Chrome Extension

这是一个 Chrome 扩展，用于在 AI Studio 网站上提供额外的功能。

## 功能

- 在 aistudio.google.com 网站上监听特定按钮的点击事件
- 显示自定义的 toast 消息

## 开发

1. 克隆仓库
2. 安装依赖：
   ```bash
   npm install
   ```

## 打包扩展

运行以下命令来打包扩展：

```bash
npm run build
```

这将在 `dist` 目录下生成 `extension.zip` 文件。

## 安装扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择包含扩展文件的文件夹

或者，你可以直接拖放 `dist/extension.zip` 文件到 Chrome 扩展页面来安装。

## 使用方法

1. 安装扩展后，访问 https://aistudio.google.com
2. 当点击指定的按钮时，会显示一个 "Hello World" 的 toast 消息 