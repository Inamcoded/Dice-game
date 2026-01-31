const cord = document.querySelector(".pull-cord");
const knob = document.querySelector(".pull-cord .knob");
const loginArea = document.querySelector(".login-area");
const light = document.querySelector(".lamp-light");

let isOn = false;
let isDragging = false;
let startY = 0;

const MAX_DRAG = 60;

function updateLamp() {
  if (isOn) {
    loginArea.classList.remove("lamp-off");
    loginArea.classList.add("lamp-on");
    light.style.opacity = "1";
  } else {
    loginArea.classList.remove("lamp-on");
    loginArea.classList.add("lamp-off");
    light.style.opacity = "0";
  }
}

function startDrag(e) {
  isDragging = true;
  startY = e.touches ? e.touches[0].clientY : e.clientY;
  knob.style.transition = "none";

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", stopDrag);
}

function drag(e) {
  if (!isDragging) return;

  const currentY = e.touches ? e.touches[0].clientY : e.clientY;
  let diff = currentY - startY;

  diff = Math.max(0, Math.min(diff, MAX_DRAG));
  knob.style.top = diff + "px";
}

function stopDrag() {
  if (!isDragging) return;

  isDragging = false;

  const draggedEnough = parseInt(knob.style.top) > 35;

  if (draggedEnough) {
    isOn = !isOn;
    updateLamp();
  }

  
  knob.style.transition = "top 0.25s ease";
  knob.style.top = "0px";

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", stopDrag);
}

cord.addEventListener("mousedown", startDrag);
cord.addEventListener("touchstart", startDrag);
