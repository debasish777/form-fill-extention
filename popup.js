document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const phoneInput = document.getElementById('userPhone');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // 1. Load previously saved data from chrome.storage
  chrome.storage.local.get(['customName', 'customEmail', 'customPhone'], (result) => {
    if (result.customName) nameInput.value = result.customName;
    if (result.customEmail) emailInput.value = result.customEmail;
    if (result.customPhone) phoneInput.value = result.customPhone;
  });

  // 2. Save data when button is clicked
  saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      customName: nameInput.value,
      customEmail: emailInput.value,
      customPhone: phoneInput.value
    }, () => {
      statusDiv.innerText = "Saved successfully!";
      setTimeout(() => { statusDiv.innerText = ""; }, 2000);
    });
  });
});