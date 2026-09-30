// @ts-nocheck
import { WidgetBase, registerWidget } from "./widgets.js";

// Rework betereKlok door JJorne, origineel was door Lou en Lukas
class ClockWidget extends WidgetBase {
  #interval;

  get category() {
    return "other";
  }

  get name() {
    return "ClockWidget";
  }

  override defaultSettings() {
    return {
      showSecondsDial: true,
      showDigitalClock: true,
    };
  }

  override onSettingsChange() {
    const secondsDial = this.element.querySelector(".rotatingSec");
    const digitalClock = this.element.querySelector(".clock-bottom");
    if (secondsDial) {
      secondsDial.classList.toggle(
        "clock-seconds-hidden",
        !this.settings.showSecondsDial
      );
    }
    if (digitalClock) digitalClock.hidden = !this.settings.showDigitalClock;
  }

  async createContent() {
    let clockContainer = document.createElement("div");
    clockContainer.classList.add("smpp-widget-transparent");
    clockContainer.classList.add("clock-widget");

    clockContainer.innerHTML = `
      <div class="mid"></div>
      <div class="midCover"></div>
      <div class="backdrop"></div>
      <div>
        <div class='rotatingSec wijzer ${this.settings.showSecondsDial ? "" : "clock-seconds-hidden"}'></div>
        <div class='rotatingMin wijzer'></div>
        <div class='rotatingHour wijzer'></div>
      </div>`;

    function setAnimPosition(selector, seconds) {
      var anim = clockContainer.querySelector(selector)?.getAnimations()[0];
      if (anim) anim.currentTime = seconds * 1000;
    }

    function updateClock() {
      var now = new Date();

      var secs = now.getSeconds() + now.getMilliseconds() / 1000;
      var mins = now.getMinutes() * 60 + secs;
      var hours = (now.getHours() % 12) * 3600 + mins;

      setAnimPosition(".rotatingSec", secs);
      setAnimPosition(".rotatingMin", mins);
      setAnimPosition(".rotatingHour", hours);
      return 1;
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateClock();
    });

    const interval = setInterval(function () {
      if (!document.hidden) updateClock();
    }, 10000);

    const tempInterval = setInterval(function () {
      if (!document.hidden){
        if (updateClock()){clearInterval(tempInterval);};
      }
    }, 1000);

    // digital part
    let bottomContainer = document.createElement("div");
    bottomContainer.classList.add("clock-bottom");
    bottomContainer.hidden = !this.settings.showDigitalClock;
    clockContainer.appendChild(bottomContainer);

    let timeEl = document.createElement("div");
    timeEl.classList.add("digital-time");
    timeEl.innerText = "??:??";
    bottomContainer.appendChild(timeEl);

    clockContainer.appendChild(bottomContainer);

    function updateDigiClock() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      timeEl.innerText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    var now = new Date();
    var delay = (now.getSeconds()*1000 + now.getMilliseconds()) % 60000;
    const tempIntervalDigi = setInterval(function () {
      if (!document.hidden){
        updateDigiClock();
        clearInterval(tempIntervalDigi);
        const tempIntervalDigi = setInterval(function () {
          if (!document.hidden){
          updateDigiClock();
        }},60000);
      }
    }, delay);
    updateDigiClock();
    return clockContainer;
  }

  async createPreview() {
    // dit is identiek tot de originele preview code voor de redo
    let div = document.createElement("div");
    div.classList.add("clock-widget-preview");

    let title = document.createElement("div");
    title.classList.add("clock-preview-title");
    title.innerText = "Clock";
    div.appendChild(title);

    let container = document.createElement("div");
    container.classList.add("clock-container");
    div.appendChild(container);

    let clockFace = document.createElement("div");
    clockFace.classList.add("clock-face");
    container.appendChild(clockFace);

    let minuteHand = document.createElement("div");
    minuteHand.classList.add("clock-hand", "minute-hand");
    minuteHand.style.transform = "rotate(0deg)";
    clockFace.appendChild(minuteHand);

    let hourHand = document.createElement("div");
    hourHand.classList.add("clock-hand", "hour-hand");
    hourHand.style.transform = "rotate(0deg)";
    clockFace.appendChild(hourHand);

    let secondHand = document.createElement("div");
    secondHand.classList.add("clock-hand", "second-hand");
    secondHand.style.transform = "rotate(0deg)";
    clockFace.appendChild(secondHand);

    const centerCircle = document.createElement("div");
    centerCircle.classList.add("clock-center");
    clockFace.appendChild(centerCircle);

    let secondsAngle = 50;
    let minutesAngle = 120;
    let hoursAngle = 240;

    secondHand.style.transform = `translate(-50%, -100%) rotate(${secondsAngle}deg)`;
    minuteHand.style.transform = `translate(-50%, -100%) rotate(${minutesAngle}deg)`;
    hourHand.style.transform = `translate(-50%, -100%) rotate(${hoursAngle}deg)`;

    return div;
  }

  async onThemeChange() {}
}

registerWidget(new ClockWidget());
