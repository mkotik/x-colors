const STYLE_ID = 'twitter-bg-changer-style';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyColor(color) {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
    body {
      background-color: ${color} !important;
    }
    div[data-testid="primaryColumn"] {
      background-color: ${color} !important;
    }
    .r-kemksi {
      background-color: ${color} !important;
    }
    div[aria-label="Home timeline"] > *:first-child > *:first-child {
      background-color: ${hexToRgba(color, 0.65)} !important;
    }
    div[aria-label="Home timeline"] > *:first-child > *:first-child > *:first-child > *:first-child > *:first-child > *:first-child {
      background-color: ${color} !important;
    }
  `;
}

function resetColor() {
  const style = document.getElementById(STYLE_ID);
  if (style) {
    style.remove();
  }
}

// Apply saved color on page load
chrome.storage.sync.get('bgColor', (data) => {
  if (data.bgColor) {
    applyColor(data.bgColor);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'changeColor') {
    applyColor(msg.color);
  } else if (msg.action === 'resetColor') {
    resetColor();
  }
});
