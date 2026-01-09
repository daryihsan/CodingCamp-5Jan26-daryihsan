const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
    if (todoInput.value === '' || dateInput.value === '') {
        alert("Isi tugas dan tanggalnya dulu ya!");
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${todoInput.value}</td>
        <td>${dateInput.value}</td>
        <td>Pending</td>
        <td><button onclick="this.parentElement.parentElement.remove()">Delete</button></td>
    `;

    todoList.appendChild(row);
    
    todoInput.value = '';
    dateInput.value = '';
});