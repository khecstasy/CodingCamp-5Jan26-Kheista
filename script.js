// ===== DATABASE (LOCAL) =====
let tasks = [];
let filterStatus = "all"; // all | completed | pending

// ===== ELEMENTS =====
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const progressPercentEl = document.getElementById("progressPercent");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterBtn = document.getElementById("filterBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");

// ===== ADD TASK =====
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const dueDate = dateInput.value;

  if (!taskText || !dueDate) {
    alert("Please enter task and due date");
    return;
  }

  tasks.push({
    id: Date.now(),
    text: taskText,
    date: dueDate,
    completed: false
  });

  taskInput.value = "";
  dateInput.value = "";

  renderTasks();
});

// ===== DELETE TASK =====
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// ===== TOGGLE STATUS =====
function toggleStatus(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  renderTasks();
}

// ===== FILTER BUTTON =====
filterBtn.addEventListener("click", () => {
  if (filterStatus === "all") filterStatus = "pending";
  else if (filterStatus === "pending") filterStatus = "completed";
  else filterStatus = "all";

  filterBtn.innerText = `Filter: ${filterStatus}`;
  renderTasks();
});

// ===== SEARCH =====
searchInput.addEventListener("input", renderTasks);

// ===== RENDER TASKS =====
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = [...tasks];
  updateStats();

  // Filter by status
  if (filterStatus === "completed") {
    filteredTasks = filteredTasks.filter(t => t.completed);
  } else if (filterStatus === "pending") {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  }

  // Search
  const keyword = searchInput.value.toLowerCase();
  filteredTasks = filteredTasks.filter(t =>
    t.text.toLowerCase().includes(keyword)
  );

  // ===== DATE FORMAT =====
  function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <tr class="empty">
        <td colspan="4">No tasks found</td>
      </tr>
    `;
    return;
  }

  filteredTasks.forEach(task => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.text}</td>
      <td>${formatDate(task.date)}</td>
      <td>
        <button onclick="toggleStatus(${task.id})">
          ${task.completed ? "Completed" : "Pending"}
        </button>
      </td>
      <td>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;

    taskList.appendChild(row);
  });
}

  deleteAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("No tasks to delete");
    return;
  }

  const confirmDelete = confirm(
    "Are you sure you want to delete all tasks?"
  );

  if (confirmDelete) {
    tasks = [];
    renderTasks();
  }
});

  function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  totalTasksEl.innerText = total;
  completedTasksEl.innerText = completed;
  pendingTasksEl.innerText = pending;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressPercentEl.innerText = `${progress}%`;
}
