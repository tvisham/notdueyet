// =======================
// initialization & globals
// =======================
let currentClass = '';
let classes = JSON.parse(localStorage.getItem('classes') || '[]');
let assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
let currentSubtasks = [];

let currentYear, currentMonth;

// =======================
// subtask handling
// =======================
function renderSubtasks() {
  const subtaskList = document.getElementById('subtask-list');
  if (!subtaskList) return;
  subtaskList.innerHTML = '';
  currentSubtasks.forEach((subtask, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" ${subtask.done ? 'checked' : ''} onchange="toggleSubtaskDone(${index})">
        <span style="${subtask.done ? 'text-decoration: line-through;' : ''}">${subtask.text}</span>
      </label>
      <button type="button" onclick="removeSubtask(${index})">×</button>
    `;
    subtaskList.appendChild(li);
  });
}

window.removeSubtask = function(index) {
  currentSubtasks.splice(index, 1);
  renderSubtasks();
};

window.toggleSubtaskDone = function(index) {
  currentSubtasks[index].done = !currentSubtasks[index].done;
  renderSubtasks();
};

// =======================
// debug helper
// =======================
function debugAssignments() {
  console.log('--- debug assignments ---');
  console.log('current class:', currentClass);
  console.log('all assignments:', assignments);
  assignments.forEach((a, i) => {
    console.log(i, 'assignment:', a.name, 'class:', a.class);
  });
}

// =======================
// on load
// =======================
window.onload = function () {
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }

  if (document.querySelector('#classes-container')) {
    renderClasses();
    renderDailyTodo();
  }

  if (document.querySelector('#class-title')) {
    currentClass = localStorage.getItem('currentClass') || '';
    assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    document.getElementById('class-title').textContent = currentClass;

    const classObj = classes.find(c => c.name.toLowerCase() === currentClass.toLowerCase());
    const classImageEl = document.getElementById('class-image');
    if (classObj && classImageEl) {
      classImageEl.src = classObj.image || 'default-banner.png';
    }

    renderAssignments();

    const assignmentForm = document.getElementById('assignment-form');
    if (assignmentForm) {
      assignmentForm.addEventListener('submit', addAssignment);
    }

    const sortPriorityBtn = document.getElementById('sort-priority');
    if (sortPriorityBtn) {
      sortPriorityBtn.addEventListener('click', sortByPriority);
    }

    const sortDateBtn = document.getElementById('sort-date');
    if (sortDateBtn) {
      sortDateBtn.addEventListener('click', sortByDate);
    }
  }

  if (document.getElementById('calendar')) {
    initCalendar();
  }

  const addAssignmentBtn = document.getElementById('add-assignment-btn');
  const assignmentModal = document.getElementById('assignment-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (addAssignmentBtn && assignmentModal) {
    addAssignmentBtn.addEventListener('click', () => {
      assignmentModal.classList.remove('hidden');
    });
  }

  if (closeModalBtn && assignmentModal) {
    closeModalBtn.addEventListener('click', () => {
      assignmentModal.classList.add('hidden');
      clearSubtasksAndForm();
    });
  }
};

// =======================
// class management
// =======================
function addClass() {
  if (classes.length >= 6) {
    alert('you can only add up to 6 classes!');
    return;
  }
  const name = prompt('enter class name:');
  if (!name) return;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = event.target.result;
        classes.push({ name, image });
        localStorage.setItem('classes', JSON.stringify(classes));
        renderClasses();
      };
      reader.readAsDataURL(file);
    }
  };

  fileInput.click();
}

function renderClasses() {
  const container = document.getElementById('classes-container');
  if (!container) return;
  container.innerHTML = '';

  classes.forEach(cls => {
    const icon = document.createElement('div');
    icon.className = 'class-icon';
    icon.innerHTML = `
      <img src="${cls.image || 'default-icon.png'}" alt="${cls.name}">
      <h3>${cls.name}</h3>
    `;
    icon.addEventListener('click', () => {
      localStorage.setItem('currentClass', cls.name);
      window.location.href = 'class.html';
    });
    container.appendChild(icon);
  });

  const addIcon = document.createElement('div');
  addIcon.className = 'class-icon add-class-icon';
  addIcon.innerHTML = `<div class="plus-symbol">+</div><h3>add class</h3>`;
  addIcon.addEventListener('click', addClass);
  container.appendChild(addIcon);
}

// =======================
// assignments
// =======================
function renderAssignments() {
  const container = document.getElementById('assignments');
  if (!container) return;
  container.innerHTML = '';

  const classAssignments = assignments.filter(a => {
    if (!a.class) return false;
    return a.class.toLowerCase().trim() === currentClass.toLowerCase().trim();
  });

  if (classAssignments.length === 0) {
    container.innerHTML = '<p>No assignments yet.</p>';
    return;
  }

  classAssignments.forEach((a, index) => {
    const row = document.createElement('div');
    row.className = 'assignment-row';
    row.dataset.priority = a.priority;

    if (a.priority === 'high') row.style.backgroundColor = '#ffe0e0';
    else if (a.priority === 'medium') row.style.backgroundColor = '#fff4cc';
    else if (a.priority === 'low') row.style.backgroundColor = '#e0ffe0';

    // Compose subtasks HTML
    let subtasksHTML = '';
    if (a.subtasks && a.subtasks.length > 0) {
      subtasksHTML = '<ul class="assignment-subtasks">';
      a.subtasks.forEach((st, i) => {
        subtasksHTML += `
          <li>
            <label>
              <input type="checkbox" ${st.done ? 'checked' : ''} onchange="toggleStoredSubtaskDone('${a.id}', ${i})">
              <span style="${st.done ? 'text-decoration: line-through;' : ''}">${st.text}</span>
            </label>
          </li>
        `;
      });
      subtasksHTML += '</ul>';
    }

    row.innerHTML = `
      <label style="display: flex; align-items: center; gap: 10px; width: 100%;">
        <input type="checkbox" style="transform: scale(1.2);" onchange="markAssignmentDone(this)">
        <span style="display: flex; flex-direction: column; width: 100%;">
          <span style="display: flex; justify-content: space-between;">
            <strong>${a.name}</strong>
            <span>${new Date(a.dueDate).toLocaleDateString()}</span>
            <span>${a.time} min</span>
          </span>
          <small style="margin-top: 4px; font-style: italic; color: #555;">${a.notes || ''}</small>
          ${subtasksHTML}
        </span>
      </label>
    `;

    container.appendChild(row);
  });
}

// Toggle subtask done status in stored assignments
window.toggleStoredSubtaskDone = function(assignmentId, subtaskIndex) {
  const assignment = assignments.find(a => a.id === assignmentId);
  if (!assignment) return;
  if (!assignment.subtasks) assignment.subtasks = [];
  assignment.subtasks[subtaskIndex].done = !assignment.subtasks[subtaskIndex].done;
  localStorage.setItem('assignments', JSON.stringify(assignments));
  renderAssignments();
};

// Add assignment with notes and subtasks
function addAssignment(e) {
  e.preventDefault();
  const nameInput = document.getElementById('assignment-name');
  const dueDateInput = document.getElementById('due-date');
  const timeInput = document.getElementById('estimated-time');
  const notesInput = document.getElementById('assignment-notes');

  if (!nameInput || !dueDateInput || !timeInput || !notesInput) return;

  const name = nameInput.value.trim();
  const dueDate = dueDateInput.value;
  const time = parseInt(timeInput.value);
  const notes = notesInput.value.trim();

  if (!name || !dueDate || isNaN(time) || time <= 0) {
    alert('please fill all assignment fields correctly.');
    return;
  }

  const priority = getPriority(dueDate, time);

  // Store subtasks as array of objects {text, done}
  const subtasksToStore = currentSubtasks.map(st => ({
    text: st.text || st,
    done: !!st.done
  }));

  const newAssignment = {
    id: Date.now().toString(),
    name,
    dueDate,
    time,
    priority,
    class: currentClass,
    notes,
    subtasks: subtasksToStore,
    progress: 0,
  };

  assignments.push(newAssignment);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  renderAssignments();
  renderDailyTodo();
  renderCalendar(currentYear, currentMonth);

  const assignmentModal = document.getElementById('assignment-modal');
  if (assignmentModal) assignmentModal.classList.add('hidden');

  e.target.reset();
  clearSubtasksAndForm();
}

function clearSubtasksAndForm() {
  currentSubtasks = [];
  renderSubtasks();
  const form = document.getElementById('assignment-form');
  if (form) form.reset();
  const subtaskInput = document.getElementById('subtask-input');
  if (subtaskInput) subtaskInput.value = '';
}

// =======================
// sorting
// =======================
function sortByPriority() {
  const rank = { high: 1, medium: 2, low: 3 };
  assignments.sort((a, b) => rank[a.priority] - rank[b.priority]);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  renderAssignments();
}

function sortByDate() {
  assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  localStorage.setItem('assignments', JSON.stringify(assignments));
  renderAssignments();
}

// =======================
// calendar
// =======================
function renderCalendar(year, month) {
  const container = document.getElementById('calendar');
  if (!container) return;
  container.innerHTML = '';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthYearHeader = document.getElementById('month-year');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (monthYearHeader) {
    monthYearHeader.textContent = `${monthNames[month]} ${year}`;
  }

  const headerRow = document.createElement('div');
  headerRow.className = 'cal-weekdays';
  days.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day-header';
    dayEl.textContent = day;
    headerRow.appendChild(dayEl);
  });
  container.appendChild(headerRow);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const datesGrid = document.createElement('div');
  datesGrid.className = 'cal-dates-grid';

  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptySlot = document.createElement('div');
    emptySlot.className = 'cal-day empty';
    datesGrid.appendChild(emptySlot);
  }

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dayDate = new Date(year, month, dayNum);
    const dayCell = document.createElement('div');
    dayCell.className = 'cal-day';
    dayCell.dataset.date = dayDate.toISOString().split('T')[0];

    const dayHeader = document.createElement('div');
    dayHeader.className = 'cal-day-header';
    dayHeader.textContent = dayNum;
    dayCell.appendChild(dayHeader);

    assignments.forEach(a => {
      const dueDate = new Date(a.dueDate);
      if (
        dueDate.getFullYear() === year &&
        dueDate.getMonth() === month &&
        dueDate.getDate() === dayNum
      ) {
        const assignmentEl = document.createElement('div');
        assignmentEl.className = 'cal-assignment';
        assignmentEl.textContent = `${a.name} (${a.class})`;
        dayCell.appendChild(assignmentEl);
      }
    });

    datesGrid.appendChild(dayCell);
  }

  const totalCells = firstDay.getDay() + daysInMonth;
  const remainder = totalCells % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      const emptySlot = document.createElement('div');
      emptySlot.className = 'cal-day empty';
      datesGrid.appendChild(emptySlot);
    }
  }

  container.appendChild(datesGrid);
}

function initCalendar() {
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();

  renderCalendar(currentYear, currentMonth);

  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentYear, currentMonth);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentYear, currentMonth);
    });
  }
}

// =======================
// daily checklist
// =======================
function renderDailyTodo() {
  const container = document.getElementById('daily-checklist');
  if (!container) return;
  container.innerHTML = '';

  const today = new Date();
  const twoDaysLater = new Date();
  twoDaysLater.setDate(today.getDate() + 2);

  const soonAssignments = assignments.filter(a => {
    const due = new Date(a.dueDate);
    return due >= today && due <= twoDaysLater;
  });

  soonAssignments.forEach((a, index) => {
    const task = document.createElement('label');
    task.className = 'daily-task checkbox-task';
    task.innerHTML = `
      <input type="checkbox" id="todo-${index}" onchange="markTodoDone('${a.id}')">
      <span class="task-info">
        <strong>${a.name}</strong> (${a.class})<br>
        due: ${new Date(a.dueDate).toLocaleDateString()}<br>
        est: ${a.time} min — priority: ${a.priority}
      </span>
    `;
    container.appendChild(task);
  });
}

// =======================
// helpers
// =======================
function getPriority(dueDate, timeNeeded) {
  const daysLeft = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  const urgency = timeNeeded / (daysLeft || 1);
  if (daysLeft <= 2 || urgency > 60) return 'high';
  if (daysLeft <= 5 || urgency > 30) return 'medium';
  return 'low';
}

function markAssignmentDone(checkbox) {
  const assignmentRow = checkbox.closest('.assignment-row');
  const name = assignmentRow?.querySelector('span strong')?.textContent;

  if (!assignmentRow || !name) return;

  assignmentRow.style.transition = 'opacity 0.3s ease';
  assignmentRow.style.opacity = '0';

  setTimeout(() => {
    assignmentRow.remove();
    assignments = assignments.filter(a => !(a.name === name && a.class.toLowerCase() === currentClass.toLowerCase()));
    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderDailyTodo();
    renderCalendar(currentYear, currentMonth);
  }, 300);
}

function markTodoDone(id) {
  const checkbox = document.getElementById(`todo-${assignments.findIndex(a => a.id === id)}`);
  const label = checkbox?.closest('label');
  if (label) {
    label.style.transition = 'opacity 0.3s ease';
    label.style.opacity = '0';
  }

  setTimeout(() => {
    label?.remove();
    assignments = assignments.filter(a => a.id !== id);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderCalendar(currentYear, currentMonth);
    renderAssignments();
  }, 300);
}
