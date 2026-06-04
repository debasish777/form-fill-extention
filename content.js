let currentDropdown = null;

// Helper function to detect field type
function detectFieldType(inputElement) {
  const name = (inputElement.name || '').toLowerCase();
  const id = (inputElement.id || '').toLowerCase();
  const placeholder = (inputElement.placeholder || '').toLowerCase();
  const type = (inputElement.type || '').toLowerCase();

  if (name.includes('email') || id.includes('email') || type === 'email') return 'email';
  if (name.includes('phone') || name.includes('tel') || id.includes('phone') || type === 'tel') return 'phone';
  if (name.includes('name') || id.includes('name') || name.includes('user')) return 'name';
  
  return 'generic';
}

// Function to fetch data from storage and build the dropdown
function showDropdown(targetInput) {
  removeDropdown();

  const fieldType = detectFieldType(targetInput);

  // Fetch the user's custom details from chrome storage
  chrome.storage.local.get(['customName', 'customEmail', 'customPhone'], (result) => {
    let options = [];

    // Map the field type to the specific custom value saved by the user
    if (fieldType === 'name' && result.customName) options.push(result.customName);
    if (fieldType === 'email' && result.customEmail) options.push(result.customEmail);
    if (fieldType === 'phone' && result.customPhone) options.push(result.customPhone);

    // If the user hasn't set anything or it's a generic field, show a fallback or skip
    if (options.length === 0) {
      return; // No custom data to show for this parameter field
    }

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'custom-form-filler-dropdown';

    // Populate options
    options.forEach(text => {
      const optionItem = document.createElement('div');
      optionItem.className = 'dropdown-item';
      optionItem.innerText = text;

      optionItem.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
        targetInput.value = text;
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        removeDropdown();
      });

      dropdown.appendChild(optionItem);
    });

    // Position calculation
    const rect = targetInput.getBoundingClientRect();
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.width = `${rect.width}px`;

    document.body.appendChild(dropdown);
    currentDropdown = dropdown;
  });
}

function removeDropdown() {
  if (currentDropdown) {
    currentDropdown.remove();
    currentDropdown = null;
  }
}

// Global Event Listeners
document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    showDropdown(e.target);
  }
});

document.addEventListener('focusout', (e) => {
  setTimeout(removeDropdown, 200);
});

window.addEventListener('resize', removeDropdown);
window.addEventListener('scroll', removeDropdown);