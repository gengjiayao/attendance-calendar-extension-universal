(() => {
  "use strict";

  const installationMarker = "data-attendance-calendar-color-installed";
  if (document.documentElement.hasAttribute(installationMarker)) return;
  document.documentElement.setAttribute(installationMarker, "true");

  const redClass = "calendar__status-dot--custom-red";
  const greenClass = "calendar__status-dot--custom-green";
  const grayClass = "calendar__status-dot--custom-gray";
  const red = "rgb(245, 108, 108)";
  const green = "rgb(103, 194, 58)";
  const gray = "rgb(144, 147, 153)";

  if (document.getElementById("attendance-calendar-day-color")) return;

  const style = document.createElement("style");
  style.id = "attendance-calendar-day-color";
  style.textContent = `
    .calendar__day .circle.${redClass} {
      background: ${red} !important;
    }

    .calendar__day .circle.${greenClass} {
      background: ${green} !important;
    }

    .calendar__day .circle.${grayClass} {
      background: ${gray} !important;
    }
  `;

  document.head.appendChild(style);

  const randomInteger = (minimum, maximum) =>
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  const eveningWindows = [
    [18 * 60 + 20, 18 * 60 + 29],
    [19 * 60 + 5, 19 * 60 + 14],
    [20 * 60 + 40, 20 * 60 + 49],
    [22 * 60 + 50, 22 * 60 + 59],
  ];
  const isInEveningWindow = (minutes) =>
    eveningWindows.some(
      ([windowStart, windowEnd]) =>
        minutes >= windowStart && minutes <= windowEnd,
    );
  const otherEveningMinutes = Array.from(
    { length: 22 * 60 + 59 - (18 * 60 + 1) + 1 },
    (_, index) => 18 * 60 + 1 + index,
  ).filter((minutes) => !isInEveningWindow(minutes));

  const createEndTime = () => {
    if (Math.random() < 0.9) {
      const [windowStart, windowEnd] =
        eveningWindows[randomInteger(0, eveningWindows.length - 1)];
      return randomInteger(windowStart, windowEnd);
    }

    return otherEveningMinutes[
      randomInteger(0, otherEveningMinutes.length - 1)
    ];
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes,
    ).padStart(2, "0")}`;
  };

  const createAttendance = (state) => {
    if (state === "gray") {
      return {
        startTime: "暂无",
        endTime: "暂无",
        workingHours: "0 小时",
        status: "未打卡",
        statusColor: gray,
      };
    }

    const endMinutes = createEndTime();

    // 根据末次时间反推首次时间，确保间隔严格大于 9 小时。
    const minimumIntervalMinutes = 9 * 60 + 1;
    const latestStartMinutes = endMinutes - minimumIntervalMinutes;
    const startMinutes =
      state === "green"
        ? randomInteger(8 * 60 + 20, Math.min(8 * 60 + 59, latestStartMinutes))
        : randomInteger(9 * 60, Math.min(10 * 60 + 30, latestStartMinutes));
    const intervalMinutes = endMinutes - startMinutes;
    const workingHours = Number((intervalMinutes / 60).toFixed(2));

    return {
      startTime: formatTime(startMinutes),
      endTime: formatTime(endMinutes),
      workingHours: `${workingHours} 小时`,
      status: state === "green" ? "正常" : "异常",
      statusColor: state === "green" ? green : red,
    };
  };

  const updateAttendanceDetails = (attendance) => {
    const selector =
      ".data-panel .van-grid-item__content.van-grid-item__content--center.van-hairline";
    const items = Array.from(document.querySelectorAll(selector));
    if (items.length < 4) return;

    const values = items.slice(0, 4).map((item) =>
      item.querySelector(".van-grid-item__text"),
    );
    if (values.some((value) => !value)) return;

    values[0].textContent = attendance.startTime;
    values[1].textContent = attendance.endTime;
    values[2].textContent = attendance.workingHours;

    const statusTag = document.createElement("span");
    statusTag.className = "van-tag van-tag--default";
    statusTag.style.backgroundColor = attendance.statusColor;
    statusTag.style.color = "rgb(255, 255, 255)";
    statusTag.textContent = attendance.status;
    values[3].replaceChildren(statusTag);
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const day = target.closest(".calendar__day");
      if (!day) return;

      const circle = day.querySelector(".circle[data-v-4a114aa8], .circle");
      if (!circle) return;

      const circleColor = getComputedStyle(circle).backgroundColor;
      const normalizeColor = (color) => color.replaceAll(" ", "");
      const isRed =
        circle.classList.contains(redClass) ||
        normalizeColor(circleColor) === normalizeColor(red);
      const isGreen =
        circle.classList.contains(greenClass) ||
        normalizeColor(circleColor) === normalizeColor(green);
      circle.classList.remove(redClass, greenClass, grayClass);

      let nextState;
      if (isRed) {
        // 红色 -> 绿色
        circle.classList.add(greenClass);
        nextState = "green";
      } else if (isGreen) {
        // 绿色 -> 灰色
        circle.classList.add(grayClass);
        nextState = "gray";
      } else {
        // 灰色或其他原始颜色 -> 红色
        circle.classList.add(redClass);
        nextState = "red";
      }

      const attendance = createAttendance(nextState);

      // 等待页面自身的 Vue 点击处理完成，再覆盖详情区内容；
      // 使用同一组随机结果多阶段重试，以兼容首次进入页面时的异步渲染。
      [0, 120, 300, 600, 1000].forEach((delay) => {
        setTimeout(() => updateAttendanceDetails(attendance), delay);
      });
    },
    true,
  );

  const notice = document.createElement("div");
  notice.textContent = "考勤脚本已启用";
  Object.assign(notice.style, {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    zIndex: "999999",
    padding: "10px 14px",
    borderRadius: "6px",
    color: "white",
    background: "rgb(103, 194, 58)",
    fontSize: "14px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.18)",
  });
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 2500);

  console.info("[attendance-calendar-color] loaded");
})();
