class User {
  constructor(
    username,
    email,
    uid,
    photoURL = "https://i.pinimg.com/originals/7c/d3/d4/7cd3d4a24e4821ead74b90cb8a55a692.jpg",
  ) {
    this.$username = username;
    this.$email = email;
    this.$uid = uid;
    this.$photoURL = photoURL;
  }

  toObject() {
    return {
      username: this.$username,
      email: this.$email,
      uid: this.$uid,
      photoURL: this.$photoURL,
    };
  }
}

class Task {
  constructor(
    taskId,
    created_by,
    taskName,
    taskDesc,
    taskLocation,
    startDate,
    endDate,
    colorCode,
  ) {
    this.$taskId = taskId;
    this.$created_by = created_by;
    this.$taskName = taskName;
    this.$taskDesc = taskDesc;
    this.$taskLocation = taskLocation;
    this.$startDate = startDate;
    this.$endDate = endDate;
    this.$colorCode = colorCode;
  }

  toObject() {
    return {
      created_by: this.$created_by,
      taskName: this.$taskName,
      taskDesc: this.$taskDesc,
      taskLocation: this.$taskLocation,
      startDate: this.$startDate,
      endDate: this.$endDate,
      colorCode: this.$colorCode,
    };
  }

  toUIHTMLTag(currentViewDate, overlapClass = "event-full") {
    const viewDate = new Date(currentViewDate);
    viewDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(viewDate);
    nextDay.setDate(viewDate.getDate() + 1);

    const taskStart = new Date(this.$startDate);
    const taskEnd = new Date(this.$endDate);

    if (taskEnd <= viewDate || taskStart >= nextDay) return "";

    const displayStart = taskStart < viewDate ? viewDate : taskStart;
    const displayEnd = taskEnd > nextDay ? nextDay : taskEnd;

    const startHour = displayStart.getHours() + displayStart.getMinutes() / 60;
    const endHour =
      taskEnd > nextDay
        ? 24
        : displayEnd.getHours() + displayEnd.getMinutes() / 60;

    const hourHeight = 48;
    const topPosition = startHour * hourHeight;
    const totalHeight = (endHour - startHour) * hourHeight;

    const continuesBefore = taskStart < viewDate;
    const continuesAfter = taskEnd > nextDay;

    return `
      <div class="calendar-event ${this.$colorCode} ${overlapClass}"
           style="top:${topPosition}px;height:${totalHeight}px;
           ${continuesBefore ? "border-top:2px dashed rgba(255,255,255,.5);" : ""}
           ${continuesAfter ? "border-bottom:2px dashed rgba(255,255,255,.5);" : ""}"
           data-task-id="${this.$taskId}"
           data-title="${this.$taskName}"
           data-desc="${this.$taskDesc || ""}"
           data-loc="${this.$taskLocation || ""}">
        <div class="fw-bold">
          ${this.$taskName}
          ${continuesBefore ? '<i class="bi bi-arrow-up-short"></i>' : ""}
        </div>
        <small>
          ${displayStart.getHours()}:00 -
          ${taskEnd > nextDay ? "Midnight" : displayEnd.getHours() + ":00"}
        </small>
        ${continuesAfter ? '<div class="text-end"><i class="bi bi-arrow-down-short"></i></div>' : ""}
      </div>
    `;
  }
}

const colorCode = [
  { cssSelector: "bg-google-blue", name: "Blue (Default)", hex: "#039be5" },
  { cssSelector: "bg-google-lavender", name: "Lavender", hex: "#7986cb" },
  { cssSelector: "bg-google-sage", name: "Sage", hex: "#33b679" },
  { cssSelector: "bg-google-flamingo", name: "Flamingo", hex: "#e67c73" },
  { cssSelector: "bg-google-banana", name: "Banana", hex: "#f6bf26" },
  { cssSelector: "bg-google-tangerine", name: "Tangerine", hex: "#f4511e" },
  { cssSelector: "bg-google-grape", name: "Grape", hex: "#8e24aa" },
  { cssSelector: "bg-google-graphite", name: "Graphite", hex: "#616161" },
];

export { User, Task, colorCode };
