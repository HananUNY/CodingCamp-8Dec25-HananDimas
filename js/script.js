// Inisialisasi todo dari localStorage atau array kosong
let todo = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; // Filter default

// Migrasi: Pastikan semua todo memiliki kolom yang valid
todo = todo.map(t => {
    return {
        id: t.id || Date.now() + Math.random(),
        task: t.task,
        date: t.date,
        completed: t.completed,
        priority: t.priority || 'low' // Prioritas default
    };
});
saveTodos();

// Fungsi pembantu untuk menyimpan ke localStorage
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todo));
    } catch (e) {
        console.error("Gagal menyimpan:", e);
    }
}

// Fungsi Tambah Todo
window.addTodo = function () {
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");
    const todoPriority = document.getElementById("todo-priority");

    if (todoInput.value.trim() === "") {
        alert("Mohon masukkan tugas!");
        return;
    }

    const todoObj = {
        id: Date.now(),
        task: todoInput.value,
        date: todoDate.value,
        priority: todoPriority.value, // Ambil nilai prioritas
        completed: false
    };

    todo.push(todoObj);
    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoDate.value = "";
    // Reset ke low agar aman
    todoPriority.value = "low";
}

// Fungsi Hapus Todo
window.deleteTodo = function (id) {
    todo = todo.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Fungsi Ubah Status Selesai (Toggle)
window.toggleComplete = function (id) {
    todo = todo.map(t => {
        if (t.id === id) {
            return { ...t, completed: !t.completed };
        }
        return t;
    });
    saveTodos();
    renderTodos();
}

// Logika Filter
window.setFilter = function (filterType) {
    currentFilter = filterType;
    renderTodos();

    // Perbarui Gaya Tombol
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        // Reset semua ke warna abu-abu/default
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    // Terapkan kembali warna aktif (biru) pada tombol yang sesuai
    buttons.forEach(btn => {
        const txt = btn.innerText.toLowerCase();
        // Pemetaan manual
        let match = false;
        if (filterType === 'all' && txt === 'all') match = true;
        if (filterType === 'completed' && txt === 'done') match = true;
        if (filterType === 'high' && txt === 'high') match = true;
        if (filterType === 'medium' && txt === 'medium') match = true;
        if (filterType === 'low' && txt === 'low') match = true;

        if (match) {
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            btn.classList.add('bg-blue-500', 'text-white');
        }
    });
}

// Event Listener untuk Reset Semua (Included dalam DOMContentLoaded agar aman)
document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('btn-clear-all');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (todo.length === 0) return;
            todo = [];
            saveTodos();
            renderTodos();
        });
    }

    // Panggilan Render Awal
    renderTodos();
    // Set status visual filter awal menjadi aktif
    window.setFilter('all');
});

// Logika Render (Menampilkan daftar ke layar)
function renderTodos() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;

    todoList.innerHTML = '';

    // Implementasi Logika Filter
    let filteredTodo = todo;
    if (currentFilter === 'completed') {
        filteredTodo = todo.filter(t => t.completed);
    } else if (currentFilter !== 'all') {
        filteredTodo = todo.filter(t => t.priority === currentFilter);
    }

    if (filteredTodo.length === 0) {
        todoList.innerHTML = '<li class="text-center text-gray-400 py-4">Tidak ada tugas ditemukan...</li>';
        return;
    }

    filteredTodo.forEach(item => {
        const isChecked = item.completed ? 'checked' : '';
        const lineThrough = item.completed ? 'line-through text-gray-400' : 'text-gray-800';
        const idSafe = item.id;

        // Warna Badge Prioritas
        let priorityColor = "bg-gray-200 text-gray-700";
        if (item.priority === 'high') priorityColor = "bg-red-100 text-red-700 border-red-200";
        if (item.priority === 'medium') priorityColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
        if (item.priority === 'low') priorityColor = "bg-green-100 text-green-700 border-green-200";

        // Tampilan tanggal yang lebih rapi
        const displayDate = item.date ? item.date.replace('T', ' jam ') : '';

        todoList.innerHTML += `
        <li class="flex items-center justify-between bg-gray-50 p-3 rounded-md border text-left shadow-sm gap-2">
            <div class="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                <input type="checkbox" ${isChecked} onchange="toggleComplete(${idSafe})" class="flex-shrink-0 w-5 h-5 text-blue-500 rounded focus:ring-blue-500 cursor-pointer">
                
                <div class="flex flex-col flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityColor}">${item.priority || 'low'}</span>
                        ${displayDate ? `<span class="text-xs text-gray-400">Tenggat: ${displayDate}</span>` : ''}
                    </div>
                    <span class="${lineThrough} text-lg font-medium break-words leading-tight">${item.task}</span>
                </div>
            </div>
            
            <button onclick="deleteTodo(${idSafe})" class="flex-shrink-0 text-red-400 hover:text-red-600 p-2 transition" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </li>`;
    });
}