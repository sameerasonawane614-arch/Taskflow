/* ---------- TASKS ---------- */

const todoList = document.getElementById("todoList");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.addTask = function () {
  const text = taskInput.value.trim();
  const date = dateInput.value;
  if (!text) return;

  const tasks = getTasks();
  tasks.push({
    id: Date.now(),
    text,
    date,
    status: "todo",
    done: false
  });

  saveTasks(tasks);
  renderTaskList();

  taskInput.value = "";
  dateInput.value = "";
};

function renderTaskList() {
  const tasks = getTasks();
  todoList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    li.classList.add("task-item");

    li.innerHTML = `
  <input type="checkbox" ${task.done ? "checked" : ""}>

  <div class="task-content">
    <span class="task-text">${task.text}</span>
    <span class="task-date">${task.date || ""}</span>
  </div>

  <button class="delete-btn">🗑</button>
`;

    // Checkbox
    li.querySelector("input").onchange = e => {
      task.done = e.target.checked;
      saveTasks(tasks);
    };

    // Delete task
    li.querySelector(".delete-btn").onclick = () => {

      let history = JSON.parse(localStorage.getItem("history")) || [];

      history.push({
        type: "task",
        text: task.text,
        deletedAt: new Date().toLocaleString(),
        timestamp: Date.now()
      });

      localStorage.setItem("history", JSON.stringify(history));

      const updated = tasks.filter(t => t.id !== task.id);
      saveTasks(updated);
      renderTaskList();
    };

    todoList.appendChild(li);
  });
}

/* ---------- NOTES ---------- */

const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const notesList = document.getElementById("notesList");

function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

window.addNote = function () {
  const title = noteTitle.value || "Untitled";
  const text = noteText.value.trim();
  if (!text) return;

  const notes = getNotes();
  notes.push({ title, text, pinned: false });

  saveNotes(notes);
  noteTitle.value = "";
  noteText.value = "";
  renderNotes();
};



window.togglePin = function (i) {
  const notes = getNotes();
  notes[i].pinned = !notes[i].pinned;
  saveNotes(notes);
  renderNotes();
};

window.deleteNote = function (i) {
  const notes = getNotes();
  const deletedNote = notes[i];

  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    type: "note",
    title: deletedNote.title,
    text: deletedNote.text,
    deletedAt: new Date().toLocaleString(),
    timestamp: Date.now()
  });

  localStorage.setItem("history", JSON.stringify(history));

  notes.splice(i, 1);
  saveNotes(notes);
  renderNotes();
};

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderTaskList();
  renderNotes();
});