"use strict";
// Dữ liệu khởi tạo. Được phép chỉnh sửa hoặc thêm thuộc tính nếu cần.
const items = [
  {
    "id": 1,
    "title": "Viết báo cáo HTML",
    "dueDate": "2026-10-20",
    "priority": "Cao",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Ôn Flexbox",
    "dueDate": "2026-10-23",
    "priority": "Trung bình",
    "status": "pending"
  },
  {
    "id": 3,
    "title": "Làm bài DOM",
    "dueDate": "2026-10-19",
    "priority": "Cao",
    "status": "done"
  },
  {
    "id": 4,
    "title": "Đọc tài liệu CSS",
    "dueDate": "2026-10-25",
    "priority": "Thấp",
    "status": "pending"
  },
  {
    "id": 5,
    "title": "Thiết kế trang cá nhân",
    "dueDate": "2026-10-21",
    "priority": "Trung bình",
    "status": "done"
  }
];

// Lấy các phần tử DOM
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDeadlineInput = document.getElementById('task-deadline');
const taskPriorityInput = document.getElementById('task-priority');
const errorMessage = document.getElementById('error-message');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const emptyMessage = document.getElementById('empty-message');

// C1: Viết hàm hiển thị dữ liệu từ mảng lên DOM.
function renderTasks() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filter = filterStatus.value;

    // Lọc dữ liệu
    const filteredItems = items.filter(function(item) {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        
        let matchesFilter = true;
        if (filter === 'done') {
            matchesFilter = item.status === 'done';
        } else if (filter === 'pending') {
            matchesFilter = item.status === 'pending';
        }
        
        return matchesSearch && matchesFilter;
    });

    // Xóa danh sách cũ
    taskList.innerHTML = '';

    // Hiện thông báo nếu rỗng
    if (filteredItems.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }

    // Render từng item
    filteredItems.forEach(function(item) {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (item.status === 'done') {
            li.classList.add('done');
        }

        const deadlineText = item.dueDate ? `Hạn: ${item.dueDate}` : 'Không có hạn';

        li.innerHTML = `
            <div class="task-info">
                <div class="task-name">${item.title}</div>
                <div class="task-details">
                    ${deadlineText} | 
                    Ưu tiên: <span class="priority-${item.priority.replace(' ', '-')}">${item.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-toggle" onclick="toggleTask(${item.id})">
                    ${item.status === 'done' ? 'Hoàn tác' : 'Xong'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${item.id})">Xóa</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// C2: Viết hàm đọc form, kiểm tra dữ liệu và thêm bản ghi.
taskForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn load lại trang

    const title = taskNameInput.value.trim();

    if (title === '') {
        errorMessage.textContent = 'Vui lòng nhập tên công việc!';
        taskNameInput.focus();
        return;
    }

    errorMessage.textContent = '';

    const newItem = {
        id: Date.now(), // Tạo ID duy nhất
        title: title,
        dueDate: taskDeadlineInput.value,
        priority: taskPriorityInput.value,
        status: 'pending' // Mặc định là chưa hoàn thành
    };

    items.push(newItem);
    renderTasks();

    // Reset form
    taskForm.reset();
    taskPriorityInput.value = 'Trung bình';
    taskNameInput.focus();
});

// C4: Viết chức năng cập nhật trạng thái và xóa theo ID.
function toggleTask(id) {
    const item = items.find(function(i) {
        return i.id === id;
    });
    
    if (item) {
        // Đảo ngược trạng thái
        if (item.status === 'done') {
            item.status = 'pending';
        } else {
            item.status = 'done';
        }
        renderTasks();
    }
}

function deleteTask(id) {
    const confirmDelete = confirm('Bạn có chắc muốn xóa công việc này?');
    if (confirmDelete) {
        const index = items.findIndex(function(i) {
            return i.id === id;
        });
        if (index !== -1) {
            items.splice(index, 1);
            renderTasks();
        }
    }
}

// C3: Viết chức năng tìm kiếm và lọc trạng thái.
searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);

// Chạy render lần đầu
renderTasks();