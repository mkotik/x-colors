const STYLE_ID = 'twitter-bg-changer-style';

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
