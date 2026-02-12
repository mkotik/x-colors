const colorPicker = document.getElementById('colorPicker');
const hexInput = document.getElementById('hexInput');
const applyBtn = document.getElementById('applyBtn');
const resetBtn = document.getElementById('resetBtn');
const presets = document.querySelectorAll('.preset');

// Load saved color on popup open
chrome.storage.sync.get('bgColor', (data) => {
  if (data.bgColor) {
    colorPicker.value = data.bgColor;
    hexInput.value = data.bgColor;
    highlightPreset(data.bgColor);
  }
});

// Sync color picker and hex input
colorPicker.addEventListener('input', () => {
  hexInput.value = colorPicker.value;
  highlightPreset(colorPicker.value);
});

hexInput.addEventListener('input', () => {
  const val = hexInput.value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    colorPicker.value = val;
    highlightPreset(val);
  }
});

// Preset buttons
presets.forEach((btn) => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    colorPicker.value = color;
    hexInput.value = color;
    highlightPreset(color);
  });
});

function highlightPreset(color) {
  presets.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === color.toLowerCase());
  });
}

// Apply color
applyBtn.addEventListener('click', () => {
  const color = colorPicker.value;
  chrome.storage.sync.set({ bgColor: color });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'changeColor', color });
    }
  });
});

// Reset to default (remove custom color)
resetBtn.addEventListener('click', () => {
  chrome.storage.sync.remove('bgColor');
  colorPicker.value = '#15202b';
  hexInput.value = '#15202b';
  highlightPreset('');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'resetColor' });
    }
  });
});
