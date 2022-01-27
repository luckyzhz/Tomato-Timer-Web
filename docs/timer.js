"use strict";

/* --------------- 变量声明 --------------- */

// 需要用到的全局变量
let timeoutID;          // timeoutID，用于清除定时器
let shouldWork = true;  // 默认处于工作状态
let minute = 0; // 当前分钟数
let second = 0; // 当前秒钟数
let rest = 0;   // 休息分钟数

// 输入框
let minuteInput = document.querySelector("#parameter-minute");
let secondInput = document.querySelector("#parameter-second");
let restInput = document.querySelector("#parameter-rest");

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

// 自动调整执行间隔的定时器
function adjustingInterval(func, interval) {  // 传入函数和执行间隔
  let expectedTime = Date.now() + interval; // 每次执行的期望时间戳
  timeoutID = setTimeout(step, interval);
  function step() {
    let drift = Date.now() - expectedTime;  // 真正执行时与期望时间戳的漂移
    expectedTime += interval;   // 更新期望的时间戳
    // 调用自身，设置下一个定时任务
    timeoutID = setTimeout(step, Math.max(0, interval - drift));
    func();   // 真正干活的部分。func 注意放在 setTimeout 之后，因为有可能包含 clearTimeout 语句！！！
  }
}

// Data URL 可以用普通文本（要先转成 URL），不一定要用 base64
// 字符串转 base64 的函数
// function b64EncodeUnicode(str) {
//   return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
//     return String.fromCharCode('0x' + p1);
//   }));
// }

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
  let svgURL = encodeURIComponent(svgString);
  img.src = "data:image/svg+xml," + svgURL;
}

// 设置面板数字
function setBoard(minute, second) {
  // 分钟面版
  setImgNumber(minuteUpper.firstChild, minute);
  setImgNumber(minuteLower.firstChild, minute);
  setImgNumber(minuteUpperAnimate.firstChild, minute);
  setImgNumber(minuteLowerAnimate.firstChild, minute);
  // 秒钟面板
  setImgNumber(secondUpper.firstChild, second);
  setImgNumber(secondLower.firstChild, second);
  setImgNumber(secondUpperAnimate.firstChild, second);
  setImgNumber(secondLowerAnimate.firstChild, second);
}

// 初始化计时器
function initialize() {
  minute = parseInt(minuteInput.value);
  second = parseInt(secondInput.value);
  rest = parseInt(restInput.value);

  // 如果是非工作状态，要执行休息时间
  if (!shouldWork) {
    minute = rest;
    second = 0;
  }
  setBoard(minute, second);
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

  // 复制的上部牌子，结束动作时，要触发的操作
  upperAnimate.addEventListener("animationend", function () {
    setImgNumber(upperAnimate.firstChild, nextValue); // 复制的上部动态牌子动画结束时，会回复原位，所以要设置为下一个值
    upperAnimate.classList.remove("upper-animate");   // 移除类名，为下一次动画做准备
  }, false);

  // 复制的下部牌子，结束动作时，要触发的操作
  lowerAnimate.addEventListener("animationend", function () {
    setImgNumber(lower.firstChild, nextValue);  // 复制的下部动态牌子动画结束时，会回复原位，露出下部牌子，所以下部牌子要设为下一个值
    lowerAnimate.classList.remove("lower-animate");   // 移除类名，为下一次动画做准备
  }, false);
}

// 播放/暂停按钮的切换
function setStartButton(str) {
  if (str === "play") {
    startButton.firstChild.innerHTML = "开始";
  } else if (str === "pause") {
    startButton.firstChild.innerHTML = "暂停";
  }
  startButton.lastChild.src = `image/icon/icon-${str}.svg`;
}

// 启动计时器
function startTimer() {
  // 设置定时更新计数板
  adjustingInterval(function () {
    if (minute > 0 || second > 0) {   // 还有剩余时间时，才需要更新计数板
      if (minute > 0 && second === 0) { // 这种情况需要更新分钟
        flip(minuteUpper, minuteUpperAnimate, minuteLower, minuteLowerAnimate, minute);
        minute--;
      }
      // 秒钟肯定需要更新
      flip(secondUpper, secondUpperAnimate, secondLower, secondLowerAnimate, second);
      if (second > 0) {
        second--;
      } else if (second === 0) {
        second = 59;
      }
    } else {  // 如果分钟秒钟都为 0，说明到达计时终点
      clearTimeout(timeoutID);  // 取消定时执行
      let dingSound = new Audio("sound/ding-sound.mp3");  // 提示音
      dingSound.play();   // 播放提示音
      shouldWork = !shouldWork;   // 更改工作状态
      setStartButton("play");     // 按钮切换到播放
    }
  }, 1000);
}

// 重置为默认值
function resetTimer() {
  clearTimeout(timeoutID);  // 取消定时执行
  minuteInput.value = 25;
  secondInput.value = 0;
  restInput.value = 5;
  timeoutID = undefined;
  shouldWork = true;
  initialize();
  setStartButton("play");
}

/* --------------- 主程序 --------------- */

// 初始化
initialize();

// 开始与暂停
startButton.addEventListener("click", function () {
  if (startButton.firstChild.innerHTML === "开始") {
    // 【计时结束】或【重置】后，计时前需要先初始化
    if (minute === 0 && second === 0 || timeoutID === undefined) {
      initialize();
    }
    startTimer();   // 开始计时
    setStartButton("pause");  // 按钮切换到暂停
  } else {
    clearTimeout(timeoutID);  // 取消定时执行
    setStartButton("play");   // 按钮切换到播放
  }
});

// 重置按钮
resetButton.addEventListener("click", function () {
  resetTimer();
})

// 全屏按钮
fullScreenButton.addEventListener("click", function () {
  document.querySelector("#timer").requestFullscreen();
  screen.orientation.lock("landscape");   // 全屏时，横向显示
});

