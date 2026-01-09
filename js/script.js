const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterSelect = document.getElementById("filter-select");
const modal = document.getElementById("custom-modal");
const modalTitle = document.getElementById("modal-title");
const modalMsg = document.getElementById("modal-message");
const modalConfirmBtn = document.getElementById("modal-confirm");
const modalCancelBtn = document.getElementById("modal-cancel");

function showCustomModal(
  title,
  message,
  isConfirm = true,
  onConfirmCallback = null
) {
  modalTitle.innerText = title;
  modalMsg.innerText = message;
  modal.style.display = "flex";

  if (isConfirm) {
    modal.classList.remove("modal-alert");
    modalConfirmBtn.innerText = "Ya, Lanjutkan";
    modalConfirmBtn.onclick = () => {
      if (onConfirmCallback) onConfirmCallback();
      modal.style.display = "none";
    };
  } else {
    modal.classList.add("modal-alert");
    modalConfirmBtn.innerText = "OK";
    modalConfirmBtn.onclick = () => {
      modal.style.display = "none";
    };
  }

  modalCancelBtn.onclick = () => {
    modal.style.display = "none";
  };
}

function checkEmpty() {
  const items = todoList.querySelectorAll(".todo-item");
  const noTaskMsg = document.getElementById("no-task");

  if (items.length === 0) {
    if (!noTaskMsg) {
      todoList.innerHTML = `<tr id="no-task"><td colspan="4" style="text-align:center; opacity: 0.5; padding: 20px;">No task found</td></tr>`;
    }
  } else {
    if (noTaskMsg) noTaskMsg.remove();
  }
}

checkEmpty();

function addTask() {
  const taskValue = todoInput.value.trim();
  const dateValue = dateInput.value;

  if (taskValue === "" || dateValue === "") {
    showCustomModal(
      "Input Kosong",
      "Jangan lupa isi tugas dan tanggalnya ya!",
      false
    );
    return;
  }

  const noTaskMsg = document.getElementById("no-task");
  if (noTaskMsg) noTaskMsg.remove();

  const row = document.createElement("tr");
  row.classList.add("todo-item", "pending");

  row.innerHTML = `
        <td class="task-text">${taskValue}</td>
        <td>${dateValue}</td>
        <td><span class="status-badge pending-badge">Pending</span></td>
        <td><button class="btn-del">Delete</button></td>
    `;

  const badge = row.querySelector(".status-badge");
  badge.addEventListener("click", () => {
    if (row.classList.contains("pending")) {
      row.classList.replace("pending", "completed");
      badge.classList.replace("pending-badge", "completed-badge");
      badge.innerText = "Completed";
    } else {
      row.classList.replace("completed", "pending");
      badge.classList.replace("completed-badge", "pending-badge");
      badge.innerText = "Pending";
    }
    applyFilter();
  });

  row.querySelector(".btn-del").addEventListener("click", () => {
    showCustomModal(
      "Hapus Tugas?",
      `Apakah kamu yakin ingin menghapus tugas "${taskValue}"?`,
      true,
      () => {
        row.style.opacity = "0";
        row.style.transform = "translateX(20px)"; 
        setTimeout(() => {
          row.remove();
          checkEmpty();
          applyFilter();
        }, 300);
      }
    );
  });

  todoList.appendChild(row);

  todoInput.value = "";
  dateInput.value = "";
  todoInput.focus();
  checkEmpty();
  applyFilter();
}

function applyFilter() {
  const filterValue = filterSelect.value;
  const items = todoList.querySelectorAll(".todo-item");
  let hasVisibleTask = false;

  items.forEach((item) => {
    if (filterValue === "all") {
      item.style.display = "table-row";
      hasVisibleTask = true;
    } else {
      if (item.classList.contains(filterValue)) {
        item.style.display = "table-row";
        hasVisibleTask = true;
      } else {
        item.style.display = "none";
      }
    }
  });

  const noFilterMsg = document.getElementById("no-filter-match");
  if (!hasVisibleTask && items.length > 0) {
    if (!noFilterMsg) {
      const row = document.createElement("tr");
      row.id = "no-filter-match";
      row.innerHTML = `<td colspan="4" style="text-align:center; opacity: 0.5; padding: 20px;">No task found for this filter</td>`;
      todoList.appendChild(row);
    }
  } else {
    if (noFilterMsg) noFilterMsg.remove();
  }
}

addBtn.addEventListener("click", addTask);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

deleteAllBtn.addEventListener("click", () => {
  const taskItems = todoList.querySelectorAll(".todo-item");

  if (taskItems.length === 0) {
    showCustomModal("Info", "Daftar tugas sudah kosong.", false);
    return;
  }

  showCustomModal(
    "Konfirmasi Hapus",
    "Hapus semua tugas yang ada?",
    true,
    () => {
      todoList.innerHTML = "";
      checkEmpty();
    }
  );
});

filterSelect.addEventListener("change", applyFilter);
