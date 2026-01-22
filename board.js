const todoCol = document.getElementById("todoCol");
const progressCol = document.getElementById("progressCol");
const doneCol = document.getElementById("doneCol");
const notesList = document.getElementById("notesList");

let draggedId = null;

/* ---------- TASKS ---------- */

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderBoard() {
  const tasks = getTasks();

  todoCol.innerHTML = "";
  progressCol.innerHTML = "";
  doneCol.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("li");
    card.className = "task-card";
    card.draggable = true;
    card.dataset.id = task.id;

    card.innerHTML = `
      <span>${task.text}</span>
      ${task.date ? `<small>${task.date}</small>` : ""}
    `;

    card.addEventListener("dragstart", () => {
      draggedId = task.id;
    });

    if (task.status === "todo") todoCol.appendChild(card);
    if (task.status === "progress") progressCol.appendChild(card);
    if (task.status === "done") doneCol.appendChild(card);
  });
}

function setupDrop(col, status) {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", () => {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == draggedId);
    if (task) task.status = status;
    saveTasks(tasks);
    renderBoard();
  });
}

setupDrop(todoCol, "todo");
setupDrop(progressCol, "progress");
setupDrop(doneCol, "done");

/* ---------- NOTES (READ ONLY) ---------- */

function renderNotes() {
  if (!notesList) return;

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notesList.innerHTML = "";

  notes.forEach(note => {
    const li = document.createElement("li");
    li.className = "note-card";

    li.innerHTML = `
      <strong>${note.title}</strong>
      <p>${note.text}</p>
    `;

    notesList.appendChild(li);
  });
}

/* ---------- INIT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderBoard();
  renderNotes();
});

window.addEventListener("storage", () => {
  renderBoard();
  renderNotes();
});
