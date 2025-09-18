let tasks = [];
let currentFilter = 'all';

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text === '') {
        input.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
    };

    tasks.unshift(task);
    input.value = '';
    renderTasks();
    updateStats();
    
    // Add a subtle shake animation for feedback
    const addBtn = document.querySelector('.add-btn');
    addBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addBtn.style.transform = 'scale(1)';
    }, 100);
}

function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    taskElement.style.animation = 'slideOut 0.3s ease';
    
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
        updateStats();
    }, 300);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

function renderTasks() {
    const todoList = document.getElementById('todoList');
    let filteredTasks = tasks;

    switch(currentFilter) {
        case 'active':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
    }

    if (filteredTasks.length === 0) {
        let message = 'No tasks yet!';
        if (currentFilter === 'active') message = 'No active tasks!';
        if (currentFilter === 'completed') message = 'No completed tasks!';
        
        todoList.innerHTML = `
            <div class="empty-state">
                <div>${message}</div>
                <div style="font-size: 14px; margin-top: 10px;">
                    ${currentFilter === 'all' ? 'Add a task above to get started' : ''}
                </div>
            </div>
        `;
        return;
    }

    todoList.innerHTML = filteredTasks.map(task => `
        <div class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="todo-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})"></div>
            <div class="todo-text">${escapeHtml(task.text)}</div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('remainingTasks').textContent = remaining;
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderTasks();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle Enter key in input
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initialize
    renderTasks();
    updateStats();
});