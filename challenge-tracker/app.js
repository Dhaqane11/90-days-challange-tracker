const daysGrid = document.getElementById("daysGrid");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const goalInput = document.getElementById("goal");

const saveDatesBtn = document.getElementById("saveDates");
const resetBtn = document.getElementById("reset");

// load saved info
const savedData = JSON.parse(localStorage.getItem("challengeData")) || {
  checkedDays: [],
  startDate: "",
  endDate: "",
  goal: "",
};

// set input values
startDateInput.value = savedData.startDate;
endDateInput.value = savedData.endDate;
goalInput.value = savedData.goal;

// auto-calculate end date when start date changes
startDateInput.addEventListener("change", () => {
  if (startDateInput.value) {
    const start = new Date(startDateInput.value);
    const end = new Date(start);
    end.setDate(end.getDate() + 89); // 90 days inclusive
    endDateInput.value = end.toISOString().split("T")[0];
  }
});

// build 90 days
for (let i = 1; i <= 90; i++) {
  const day = document.createElement("div");
  day.classList.add("day");
  day.textContent = i;

  // if saved as checked
  if (savedData.checkedDays.includes(i)) {
    day.classList.add("checked");
  }

  // click event
  day.addEventListener("click", () => toggleDay(i, day));

  daysGrid.appendChild(day);
}

updateMissedDays();
updateProgress();

saveDatesBtn.addEventListener("click", saveDates);
resetBtn.addEventListener("click", resetAll);

function toggleDay(dayNumber, dayElement) {
  if (dayElement.classList.contains("missed")) return;

  const index = savedData.checkedDays.indexOf(dayNumber);
  if (index === -1) {
    savedData.checkedDays.push(dayNumber);
    dayElement.classList.add("checked");
  } else {
    savedData.checkedDays.splice(index, 1);
    dayElement.classList.remove("checked");
  }
  saveData();
  updateProgress();
}

function saveDates() {
  savedData.startDate = startDateInput.value;
  savedData.endDate = endDateInput.value;
  savedData.goal = goalInput.value;
  saveData();
  updateMissedDays();
}

function saveData() {
  localStorage.setItem("challengeData", JSON.stringify(savedData));
}

function resetAll() {
  localStorage.removeItem("challengeData");
  location.reload();
}

function updateProgress() {
  const percent = Math.round((savedData.checkedDays.length / 90) * 100);
  progressBar.style.width = percent + "%";
  progressText.textContent = percent + "% Complete";
}

function updateMissedDays() {
  if (!savedData.startDate) return;
  const start = new Date(savedData.startDate);

  const allDays = document.querySelectorAll(".day");
  allDays.forEach((dayEl, idx) => {
    const dayNumber = idx + 1;
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));

    if (dayDate < new Date() && !savedData.checkedDays.includes(dayNumber)) {
      dayEl.classList.add("missed");
    }
  });
}
