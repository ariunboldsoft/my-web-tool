document.getElementById('display-phone').textContent = currentPhone;

// Unique storage key for this specific phone number
const userStorageKey = 'user_data_' + currentPhone;

// Check if data already exists for this phone number
window.addEventListener('DOMContentLoaded', () => {
  loadUserDashboard();
});

function loadUserDashboard() {
  const container = document.getElementById('profile-container');
  const savedDataRaw = localStorage.getItem(userStorageKey);

  if (!savedDataRaw) {
    // NEW USER: Show profile creation form
    container.innerHTML = `
      <h2>Шинэ профайл үүсгэх</h2>
      <p>Энэ дугаар дээр бүртгэл үүсээгүй байна. Хүүхдийнхээ мэдээллийг оруулна уу.</p>
      <label>Хүүхдийн нэр:</label>
      <input type="text" id="childName" placeholder="Жишээ нь: Тэмүүлэн">
      
      <label>Нас / Төрсөн огноо:</label>
      <input type="text" id="childAge" placeholder="Жишээ нь: 5 настай">

      <button onclick="createProfile()">Профайл үүсгэх</button>
    `;
  } else {
    // EXISTING USER: Load their saved data dashboard
    const userData = JSON.parse(savedDataRaw);
    container.innerHTML = `
      <h2>Миний Хүүхдийн Профайл</h2>
      
      <label>Хүүхдийн нэр:</label>
      <input type="text" id="childName" value="${userData.name || ''}">

      <label>Нас / Төрсөн огноо:</label>
      <input type="text" id="childAge" value="${userData.age || ''}">

      <label>Хөгжлийн тэмдэглэл:</label>
      <textarea id="childNotes" rows="4">${userData.notes || ''}</textarea>

      <button onclick="saveUserData(false)">Хадгалах</button>
    `;
  }
}

function createProfile() {
  const name = document.getElementById('childName').value.trim();
  const age = document.getElementById('childAge').value.trim();

  if (!name) {
    alert('Хүүхдийн нэрийг оруулна уу.');
    return;
  }

  const initialData = { name: name, age: age, notes: '' };
  localStorage.setItem(userStorageKey, JSON.stringify(initialData));
  loadUserDashboard(); // Reloads into the full dashboard view
}

function saveUserData(isAutoSave = false) {
  const nameInput = document.getElementById('childName');
  const ageInput = document.getElementById('childAge');
  const notesInput = document.getElementById('childNotes');

  if (!nameInput) return;

  const updatedData = {
    name: nameInput.value,
    age: ageInput ? ageInput.value : '',
    notes: notesInput ? notesInput.value : ''
  };

  localStorage.setItem(userStorageKey, JSON.stringify(updatedData));

  if (!isAutoSave) {
    alert('Мэдээлэл амжилттай хадгалаgдлаа!');
  } else {
    showAutoSaveIndicator();
  }
}

function showAutoSaveIndicator() {
  let indicator = document.getElementById('autosave-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'autosave-indicator';
    indicator.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#28a745; color:#fff; padding:8px 14px; border-radius:4px; font-size:13px; box-shadow:0 2px 6px rgba(0,0,0,0.2); transition:opacity 0.3s; z-index:1000;';
    document.body.appendChild(indicator);
  }
  indicator.textContent = 'Автоматаар хадгалагдлаа';
  indicator.style.opacity = '1';
  setTimeout(() => { indicator.style.opacity = '0'; }, 2000);
}

// Autosave every 60 seconds
setInterval(() => {
  saveUserData(true);
}, 60000);

function logout() {
  saveUserData(true);
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('currentUserPhone');
  window.location.href = 'auth.html';
}
