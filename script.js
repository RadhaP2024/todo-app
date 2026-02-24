// Task data structure [citation:6]
let tasks = [];
let currentFilter = 'all';

// DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage when page loads [citation:6]
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
});

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        try {
            tasks = JSON.parse(storedTasks);
            // Ensure tasks is an array
            if (!Array.isArray(tasks)) {
                tasks = [];
            }
        } catch (e) {
            console.error('Error parsing tasks:', e);
            tasks = [];
        }
    } else {
        tasks = [];
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        todoList.innerHTML = '<li class="empty-message">No tasks to show</li>';
        return;
    }
    
    todoList.innerHTML = '';
    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        todoList.appendChild(li);
    });
}

// Create a task DOM element [citation:6]
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = task.completed;
    
    // Task text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = task.text;
    
    // Action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actionsDiv);
    
    // Event: Toggle completion
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.classList.toggle('completed', task.completed);
        saveTasks();
        renderTasks(); // Re-render to apply filter if needed
    });
    
    // Event: Edit task
    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            span.textContent = task.text;
            saveTasks();
        }
    });
    
    // Event: Delete task
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        }
    });
    
    return li;
}

// Add new task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskText = todoInput.value.trim();
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now().toString(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    todoInput.value = ''; // Clear input
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update current filter
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});