// Initialize todos
let todo = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; // Default filter

// Migration: Ensure all todos have valid fields
todo = todo.map(t => {
    return {
        id: t.id || Date.now() + Math.random(),
        task: t.task,
        date: t.date,
        completed: t.completed,
        priority: t.priority || 'low' // Default priority
    };
});
saveTodos();

// Helper to save
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todo));
    } catch (e) {
        console.error("Storage failed:", e);
    }
}

// Add Todo
window.addTodo = function () {
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");
    const todoPriority = document.getElementById("todo-priority");

    if (todoInput.value.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    const todoObj = {
        id: Date.now(),
        task: todoInput.value,
        date: todoDate.value,
        priority: todoPriority.value, // Capture priority
        completed: false
    };

    todo.push(todoObj);
    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoDate.value = "";
    // Keep priority as is or reset? Resetting to low is safer
    todoPriority.value = "low";
}

// Delete Todo
window.deleteTodo = function (id) {
    todo = todo.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle Complete
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

// Filter Logic
window.setFilter = function (filterType) {
    currentFilter = filterType;
    renderTodos();

    // Update Button Styles
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        // Reset all to gray/default
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');

        // Highlight active
        // Note: This relies on manual matching since buttons invoke onclick with string
        // We can check text content or just re-render UI based on state later.
        // Simple hack: matching text content approximately or passing element reference.
        // For now, simpler: just re-render is enough logic-wise, visual update is bonus.
    });

    // Re-apply active class based on the text matching the filter logic usually...
    // Let's do a quick visual update based on the text content in local scope
    buttons.forEach(btn => {
        const txt = btn.innerText.toLowerCase();
        // custom mapping
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

// Reset All Event Listener (Wrapped in DOMContentLoaded for safety)
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

    // Initial Render call
    renderTodos();
    // Set initial filter active state visual
    window.setFilter('all');
});

// Render logic
function renderTodos() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;

    todoList.innerHTML = '';

    // Filter Logic Implementation
    let filteredTodo = todo;
    if (currentFilter === 'completed') {
        filteredTodo = todo.filter(t => t.completed);
    } else if (currentFilter !== 'all') {
        filteredTodo = todo.filter(t => t.priority === currentFilter);
    }

    if (filteredTodo.length === 0) {
        todoList.innerHTML = '<li class="text-center text-gray-400 py-4">No tasks found...</li>';
        return;
    }

    filteredTodo.forEach(item => {
        const isChecked = item.completed ? 'checked' : '';
        const lineThrough = item.completed ? 'line-through text-gray-400' : 'text-gray-800';
        const idSafe = item.id;

        // Priority Badge Color
        let priorityColor = "bg-gray-200 text-gray-700";
        if (item.priority === 'high') priorityColor = "bg-red-100 text-red-700 border-red-200";
        if (item.priority === 'medium') priorityColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
        if (item.priority === 'low') priorityColor = "bg-green-100 text-green-700 border-green-200";

        todoList.innerHTML += `
        <li class="flex items-center justify-between bg-gray-50 p-3 rounded-md border text-left shadow-sm gap-2">
            <div class="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                <input type="checkbox" ${isChecked} onchange="toggleComplete(${idSafe})" class="flex-shrink-0 w-5 h-5 text-blue-500 rounded focus:ring-blue-500 cursor-pointer">
                
                <div class="flex flex-col flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityColor}">${item.priority || 'low'}</span>
                        ${item.date ? `<span class="text-xs text-gray-400">${item.date.replace('T', ' ')}</span>` : ''}
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