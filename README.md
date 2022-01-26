# Tomato-Timer-Web

> 番茄计时器-网页版

# Demo

可以直接打开 GitHub Pages 查看效果：

<https://luckyzhz.github.io/Tomato-Timer-Web/>

<img src="reference/timer-demo.gif" style="width:500px; border: 1px solid black; border-radius: 4px;">

## 项目特点

这是一个用 JavaScript 配合 CSS 动画实现的【**翻牌效果**】的计时器。

优点：

1. 利用系统时间计时，因此可以准确计时。
2. CSS 动画较为流畅。
3. 响应式布局，兼容桌面端和移动端。
4. 在 Chrome 或 Safari 浏览器上运行良好。

## 已知 Bug

1. 在 Firefox 中，动画抖动，无法显示出翻牌效果。
2. 因为使用 setInterval 刷新计数板，会有时间误差，所以可能会出现跳跃更新（例如，计数板上的数字从 42 直接变成 40）。

## TODO

1. 解决计数板跳跃更新。
2. 全屏时让手机保持亮屏。
3. 息屏或切换到后台时也能保持计时。