"use strict";

/* --------------- 变量声明 --------------- */

// 需要用到的全局变量
let intervalID;     // 存放 setInterval 的返回值，以便清除定时动作


// 获取用户设置的参数
let minute = parseInt(document.querySelector("#parameter-minute").value);
let second = parseInt(document.querySelector("#parameter-second").value);
let rest = parseInt(document.querySelector("#parameter-rest").value);

// 获取动态变化的元素
let minuteBox = document.querySelector("#minute");
let minuteUpper = document.querySelector("#minute>.upper");
let minuteLower = document.querySelector("#minute>.lower");

let secondBox = document.querySelector("#second");
let secondUpper = document.querySelector("#second>.upper");
let secondLower = document.querySelector("#second>.lower");

// 复制生成动态翻页的节点，并附加到文档
let minuteUpperAnimate = minuteUpper.cloneNode(true);
minuteBox.appendChild(minuteUpperAnimate);
minuteUpperAnimate.style["z-index"] = 2;

let minuteLowerAnimate = minuteLower.cloneNode(true);
minuteBox.appendChild(minuteLowerAnimate);
minuteLowerAnimate.classList.add("lower-animate-initial");   // 上翻，并被另一个动态页盖住

let secondUpperAnimate = secondUpper.cloneNode(true);
secondBox.appendChild(secondUpperAnimate);
secondUpperAnimate.style["z-index"] = 2;

let secondLowerAnimate = secondLower.cloneNode(true);
secondBox.appendChild(secondLowerAnimate);
secondLowerAnimate.classList.add("lower-animate-initial");   // 上翻，并被另一个动态页盖住

// 获取按钮
let startButton = document.querySelector("button#start");
let resetButton = document.querySelector("button#reset");
let fullScreenButton = document.querySelector("button#full-screen");

/* --------------- 函数声明 --------------- */

// 字符串转 base64 的函数
function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

// 设置 svg 图片数字的函数
function setImgNumber(img, number) {
  let svgString =
    `<svg id="图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566.93 566.93">
  <defs>
    <style>
      .cls-1 {
        font-size: 566.93px;
        fill: #bababa;
        font-family: Arial-BoldMT, Arial, sans-serif;
        font-weight: 700;
      }
    </style>
  </defs>
  <title>未标题-2</title><text class="cls-1" transform="translate(125.82 486.37) scale(0.5 1)">${number.toString().padStart(2, '0')}</text>
</svg>`;
  let svgBase64 = b64EncodeUnicode(svgString);
  img.src = "data:image/svg+xml;base64," + svgBase64;
}

// 初始化计时器
function initialize() {
  setImgNumber(minuteUpper.firstChild, minute);
  setImgNumber(minuteLower.firstChild, minute);
  setImgNumber(minuteUpperAnimate.firstChild, minute);
  setImgNumber(minuteLowerAnimate.firstChild, minute);

  setImgNumber(secondUpper.firstChild, second);
  setImgNumber(secondLower.firstChild, second);
  setImgNumber(secondUpperAnimate.firstChild, second);
  setImgNumber(secondLowerAnimate.firstChild, second);
}


// 一次翻牌动画
function flip(upper, upperAnimate, lower, lowerAnimate, currentValue) {
  let nextValue = 0;
  if (currentValue > 0) {
    nextValue = currentValue - 1;
  } else {
    nextValue = 59;
  }

  // 设置四部分牌子的初始值
  setImgNumber(upper.firstChild, nextValue);
  setImgNumber(upperAnimate.firstChild, currentValue);
  setImgNumber(lower.firstChild, currentValue);
  setImgNumber(lowerAnimate.firstChild, nextValue);

  // 动态牌子开始动
  upperAnimate.classList.add("upper-animate");
  lowerAnimate.classList.add("lower-animate");

  // 复制的上部牌子结束动作时，要触发的操作
  upperAnimate.addEventListener("animationend", function () {
    setImgNumber(upperAnimate.firstChild, nextValue); // 复制的上部动态牌子动画结束时，会回复原位，所以要设置为下一个值
    upperAnimate.classList.remove("upper-animate");   // 移除类名，为下一次动画做准备
  }, false);

  // 复制的下部牌子结束动作时，要触发的操作
  lowerAnimate.addEventListener("animationend", function () {
    setImgNumber(lower.firstChild, nextValue);  // 复制的下部动态牌子动画结束时，会回复原位，露出下部牌子，所以下部牌子要设为下一个值
    lowerAnimate.classList.remove("lower-animate");   // 移除类名，为下一次动画做准备
  }, false);
}

// 启动计时器的函数
// 要利用系统时间，而不是直接使用 setInterval 计数
// 这样才能避免计时误差的累积
function startTimer() {
  let totalSeconds = 60 * minute + second;  // 开始计时前，先记录总秒数
  let start = Date.now();   // 记录开始时的时间戳

  // 设置定时更新计数板
  let intervalID = setInterval(function () {
    let duration = Date.now() - start;  // 通过时间戳差值，算出已持续的时间，单位是毫秒
    let leftSeconds = totalSeconds - Math.floor(duration / 1000);   // 剩余的秒数
    let newMinute = Math.floor(leftSeconds / 60);   // 最新的，应该显示在计数板的分钟数
    let newSecond = leftSeconds % 60;   // 最新的，应该显示在计数板的秒钟数

    if (leftSeconds >= 0) {   // 还有剩余时间时，才需要更新计数板
      if (newMinute !== minute) {   // 分钟数有变化才更新计数板
        flip(minuteUpper, minuteUpperAnimate, minuteLower, minuteLowerAnimate, minute);
        minute = newMinute;   // 更新分钟值
      }
      if (newSecond !== second) {   // 秒钟数有变化才更新计数板
        flip(secondUpper, secondUpperAnimate, secondLower, secondLowerAnimate, second);
        second = newSecond;   // 更新秒钟值
      }
    }
  }, 1000);

  return intervalID;  // 返回 intervalID，以便需要时可以清除定时动作
}

/* --------------- 主程序 --------------- */

// 初始化
initialize();

startButton.addEventListener("click", function () {
  intervalID = startTimer();
});



