// Create context menu options when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fillName",
    title: "Fill Saved Name",
    contexts: ["editable"] // Only shows up when right-clicking text boxes
  });

  chrome.contextMenus.create({
    id: "fillEmail",
    title: "Fill Saved Email",
    contexts: ["editable"]
  });

  chrome.contextMenus.create({
    id: "fillPhone",
    title: "Fill Saved Phone Number",
    contexts: ["editable"]
  });
});

// Listen for the user clicking an option in the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Fetch corresponding value from storage
  let storageKey = "";
  if (info.menuItemId === "fillName") storageKey = "customName";
  if (info.menuItemId === "fillEmail") storageKey = "customEmail";
  if (info.menuItemId === "fillPhone") storageKey = "customPhone";

  if (!storageKey) return;

  chrome.storage.local.get([storageKey], (result) => {
    const valueToFill = result[storageKey];
    if (valueToFill) {
      // Send the text data to content.js on the active page
      chrome.tabs.sendMessage(tab.id, { action: "insertText", text: valueToFill });
    }
  });
});