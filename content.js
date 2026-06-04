let lastRightClickedElement = null;

// Track the exact field the user right-clicked
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
    lastRightClickedElement = e.target;
  } else {
    lastRightClickedElement = null;
  }
});

// Listen for the text payload sent from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "insertText" && lastRightClickedElement) {
    
    // Insert text safely into the active element
    lastRightClickedElement.value = request.text;
    
    // Crucial for Google Forms/React: Notify the page framework that data changed
    lastRightClickedElement.dispatchEvent(new Event('input', { bubbles: true }));
    lastRightClickedElement.dispatchEvent(new Event('change', { bubbles: true }));
  }
});