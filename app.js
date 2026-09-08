// Strict Authentication Guard
const currentPhone = localStorage.getItem('currentUserPhone');
const isAuthenticated = localStorage.getItem('isAuthenticated');

if (isAuthenticated !== 'true' || !currentPhone) {
  window.location.href = 'auth.html';
}

// Display logged-in user phone in header
const phoneDisplay = document.getElementById('display-phone');
if (phoneDisplay) {
  phoneDisplay.textContent = currentPhone;
}

// User-Isolated Storage Keys
const childrenStorageKey = 'children_data_' + currentPhone;
const activeChildIdKey = 'active_child_id_' + currentPhone;

// 12 Development Goals Master List (for selection logic)
const masterDevelopmentGoals = [
  "Бие бялдрын хөгжил", "Нийгэмшихүй", "Сэтгэл хөдлөлийн хөгжил", 
  "Хэл яриа ба харилцаа", "Танин мэдэхүй", "Бүтээлч сэтгэлгээ", 
  "Логик сэтгэлгээ", "Өөртөө үйлчлэх чадвар", "Анхаарал төвлөрөлт", 
  "Хөдөлгөөний эвсэл", "Мэдрэхүйн хөгжил", "Тоглох болон хамтран ажиллах"
];

let childrenData = [];
let activeChildId = null;

window.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  
  // Clean slate handling or initialize default child if none exist
  if (childrenData.length === 0) {
    addNewChildProfile("Үндсэн хүүхэд", "5 настай");
  } else {
    activeChildId = localStorage.getItem(activeChildIdKey) || childrenData[0].id;
  }
  
  renderChildSelector();
  loadActiveChildData();
});

function loadUserData() {
  const raw = localStorage.getItem(childrenStorageKey);
  if (raw) {
    try {
      childrenData = JSON.parse(raw);
    } catch(e) {
      childrenData = [];
    }
  }
}

function saveUserData() {
  localStorage.setItem(childrenStorageKey, JSON.stringify(childrenData));
  if (activeChildId) {
    localStorage.setItem(activeChildIdKey, activeChildId);
  }
}

// Multi-child Management (Limit: 3 children max)
function openAddChildModal() {
  if (childrenData.length >= 3) {
    alert("Та хамгийн ихдээ 3 хүүхэд бүртгэх боломжтой байна.");
    return;
  }

  let name = prompt("Хүүхдийн нэрийг оруулна уу:");
  if (!name) return;
  let age = prompt("Нас / Төрсөн огноо:") || '';

  addNewChildProfile(name, age);
}

function addNewChildProfile(name, age) {
  if (childrenData.length >= 3) return;

  const newChild = {
    id: 'child_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: name,
    age: age,
    notes: '',
    selectedGoals: [] // Stores up to 4 chosen goals out of 12
  };

  childrenData.push(newChild);
  activeChildId = newChild.id;
  saveUserData();
  renderChildSelector();
  loadActiveChildData();
}

function renderChildSelector() {
  const select = document.getElementById('childSelector');
  if (!select) return;
  
  select.innerHTML = '';
  childrenData.forEach(child => {
    let opt = document.createElement('option');
    opt.value = child.id;
    opt.textContent = `👶 ${child.name} (${child.age})`;
    if (child.id === activeChildId) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function switchActiveChild() {
  const select = document.getElementById('childSelector');
  if (!select) return;
  activeChildId = select.value;
  saveUserData();
  loadActiveChildData();
}

function loadActiveChildData() {
  const child = childrenData.getItemById ? null : childrenData.find(c => c.id === activeChildId);
  if (!child) return;

  const nameInput = document.getElementById('activeChildName');
  const ageInput = document.getElementById('activeChildAge');
  const notesInput = document.getElementById('activeChildNotes');

  if (nameInput) nameInput.value = child.name || '';
  if (ageInput) ageInput.value = child.age || '';
  if (notesInput) notesInput.value = child.notes || '';

  renderGoalsMatrix(child);
}

// Live Autosave & Goal Matrix Logic (Choosing 4 main goals from 12)
function autoSaveCurrentChild() {
  const child = childrenData.find(c => c.id === activeChildId);
  if (!child) return;

  const nameInput = document.getElementById('activeChildName');
  const ageInput = document.getElementById('activeChildAge');
  const notesInput = document.getElementById('activeChildNotes');

  if (nameInput) child.name = nameInput.value;
  if (ageInput) child.age = ageInput.value;
  if (notesInput) child.notes = notesInput.value;

  saveUserData();
  renderChildSelector();
}

function renderGoalsMatrix(child) {
  let container = document.getElementById('goalsMatrixContainer');
  if (!container) return; // Optional container hook if present in your HTML layout

  container.innerHTML = '';
  masterDevelopmentGoals.forEach(goal => {
    let isSelected = child.selectedGoals && child.selectedGoals.includes(goal);
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `goal-pill ${isSelected ? 'selected' : ''}`;
    btn.textContent = goal;
    btn.onclick = () => toggleGoalSelection(child, goal);
    container.appendChild(btn);
  });
}

function toggleGoalSelection(child, goal) {
  if (!child.selectedGoals) child.selectedGoals = [];
  
  const index = child.selectedGoals.indexOf(goal);
  if (index > -1) {
    child.selectedGoals.splice(index, 1);
  } else {
    if (child.selectedGoals.length >= 4) {
      alert("Та хүүхдийн хөгжилд чиглүүлэх үндсэн 4 зорилгыг сонгосон байна.");
      return;
    }
    child.selectedGoals.push(goal);
  }
  saveUserData();
  renderGoalsMatrix(child);
}

function logout() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUserPhone');
  window.location.href = 'auth.html';
}
