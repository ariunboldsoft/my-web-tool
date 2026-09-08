// Display the current phone number on header
document.getElementById('display-phone').textContent = currentPhone;

// Unique storage keys bound strictly to this phone number
const storageKey = 'child_profile_' + currentPhone;

// Load saved data on page startup
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      document.getElementById('childName').value = data.name || '';
      document.getElementById('childAge').value = data.age || '';
      document.getElementById('childNotes').value = data.notes || '';
    } catch (e) {
      console.error('Data parsing error', e);
    }
  }
});

// Save data function (handles manual and auto-saves)
function saveUserData(isAutoSave = false) {
  const data = {
    name: document.getElementById('childName').value,
    age: document.getElementById('childAge').value,
    notes: document.getElementById('childNotes').value,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem(storageKey, JSON.stringify(data));

  if (!isAutoSave) {
    alert('Мэдээлэл амжилттай хадгалагдлаа!');
  } else {
    showAutoSaveIndicator();
  }
}

// Subtle visual popup for autosaves
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

// Background autosave every 60 seconds
setInterval(() => {
  saveUserData(true);
}, 60000);

// Logout function
function logout() {
  saveUserData(true); // Final save before leaving
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUserPhone');
  window.location.href = 'auth.html';
}
