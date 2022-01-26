# Tomato-Timer-Web

> 番茄计时器-网页版

# Demo

可以直接打开 GitHub Pages 查看效果：

<https://luckyzhz.github.io/Tomato-Timer-Web/>

<img src="reference/timer-demo.gif" style="width:500px;">

## 项目特点

这是一个用 JavaScript 配合 CSS 动画实现的【**翻牌效果**】的倒计时器。

优点：

1. 使用**自定义**的【**自动调整执行间隔的定时器函数**】，可以准确计时。
2. 不会出现跳跃更新（例如，计数板上的数字从 42 直接变成 40）。
3. CSS 动画较为流畅。
4. 运算量小，且基本维持不变。
5. 响应式布局，兼容桌面端和移动端。
6. 在 Chrome 或 Safari 浏览器上运行良好。

## 已知 Bug

1. 在 Firefox 中，动画抖动，无法显示出翻牌效果。

## TODO

1. 全屏时让手机保持亮屏。
2. 息屏或切换到后台时也能保持计时。