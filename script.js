let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let filterButtons = document.querySelectorAll(".category");

function getTodoListFromLocalStorage() {
  let data = localStorage.getItem("todoList");
  return data ? JSON.parse(data) : [];
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;
let currentFilter = "All";

saveTodoButton.onclick = () => {
  localStorage.setItem("todoList", JSON.stringify(todoList));
  showToast("Todos saved successfully!");
};

function showToast(message) {
  const toastEl = document.getElementById("liveToast");
  document.getElementById("toastMessage").textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function addTodo() {
  let userInput = document.getElementById("todoUserInput");
  let userInputValue = userInput.value.trim();

  if (userInputValue === "") {
    alert("Enter valid text");
    return;
  }

  todosCount += 1;
  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false,
    completedAt: null
  };

  todoList.push(newTodo);
  userInput.value = "";
  renderTodoList();
  showToast("Task added successfully!");
}

addTodoButton.onclick = addTodo;
document.getElementById("todoUserInput").addEventListener("keydown", e => {
  if (e.key === "Enter") addTodo();
});

function toggleTodoStatus(uniqueNo) {
  const todo = todoList.find(t => t.uniqueNo === uniqueNo);
  if (todo) {
    todo.isChecked = !todo.isChecked;
    todo.completedAt = todo.isChecked ? new Date().toLocaleDateString() : null;
  }
  renderTodoList();
}

function deleteTodo(uniqueNo) {
  todoList = todoList.filter(t => t.uniqueNo !== uniqueNo);
  renderTodoList();
  showToast("Task deleted!");
}

function createAndAppendTodo(todo) {
  const todoId = "todo" + todo.uniqueNo;
  const checkboxId = "checkbox" + todo.uniqueNo;

  const todoItem = document.createElement("li");
  todoItem.classList.add("todo-item-container");
  todoItem.id = todoId;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.checked = todo.isChecked;
  checkbox.classList.add("checkbox-input");
  checkbox.onclick = () => toggleTodoStatus(todo.uniqueNo);

  const label = document.createElement("label");
  label.setAttribute("for", checkboxId);
  label.classList.add("checkbox-label");
  label.textContent = todo.text;
  if (todo.isChecked) label.classList.add("checked");

  const labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container");
  labelContainer.appendChild(label);

  const statusText = document.createElement("div");
  statusText.classList.add("completed-time");
  statusText.textContent = todo.isChecked
    ? `Status: Completed (${todo.completedAt})`
    : `Status: In Progress`;
  labelContainer.appendChild(statusText);

  const deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
  deleteIcon.onclick = () => deleteTodo(todo.uniqueNo);

  deleteIconContainer.appendChild(deleteIcon);

  todoItem.appendChild(checkbox);
  todoItem.appendChild(labelContainer);
  todoItem.appendChild(deleteIconContainer);

  todoItemsContainer.appendChild(todoItem);
}

function renderTodoList() {
  todoItemsContainer.innerHTML = "";

  let filteredTodos = [];
  if (currentFilter === "All") {
    filteredTodos = todoList;
  } else if (currentFilter === "Active") {
    filteredTodos = todoList.filter(todo => !todo.isChecked);
  } else if (currentFilter === "Completed") {
    filteredTodos = todoList.filter(todo => todo.isChecked);
  }

  if (filteredTodos.length === 0) {
    todoItemsContainer.innerHTML = `<p class="empty-message">No tasks found.</p>`;
    return;
  }

  for (let todo of filteredTodos) {
    createAndAppendTodo(todo);
  }

  localStorage.setItem("todoList", JSON.stringify(todoList));
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.getAttribute("data-filter");
    renderTodoList();
  });
});

renderTodoList();
