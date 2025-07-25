export async function sendSMS(phoneNumbersArray, message) {
  console.log("phone array", phoneNumbersArray);
  
  try {
    const response = await fetch('http://localhost:3001/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumbers: [phoneNumbersArray.join(',')], // Join if sending to multiple numbers
        message: message,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();
    console.log('SMS sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}



document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const subscribersTab = document.getElementById('subscribersTab');
  const messagesTab = document.getElementById('messagesTab');
  const subscribersContent = document.getElementById('subscribersContent');
  const messagesContent = document.getElementById('messagesContent');
  const subscribersList = document.getElementById('subscribersList');
  const searchInput = document.getElementById('searchInput');
  const subscriberCount = document.getElementById('subscriberCount');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const deselectAllBtn = document.getElementById('deselectAllBtn');
  const selectedCount = document.getElementById('selectedCount');
  const messageType = document.getElementById('messageType');
  const messageSubject = document.getElementById('messageSubject');
  const messageContent = document.getElementById('messageContent');
  const includeLocation = document.getElementById('includeLocation');
  const previewBtn = document.getElementById('previewBtn');
  const sendBtn = document.getElementById('sendBtn');
  const previewModal = document.getElementById('previewModal');
  const closePreview = document.getElementById('closePreview');
  const previewType = document.getElementById('previewType');
  const previewSubject = document.getElementById('previewSubject');
  const previewContent = document.getElementById('previewContent');
  const previewRecipients = document.getElementById('previewRecipients');
  const cancelSendBtn = document.getElementById('cancelSendBtn');
  const confirmSendBtn = document.getElementById('confirmSendBtn');
  const statusMessage = document.getElementById('statusMessage');

  // Tab switching
  subscribersTab.addEventListener('click', () => {
    subscribersTab.classList.add('tab-active');
    subscribersTab.classList.remove('text-gray-600');
    subscribersTab.classList.add('text-indigo-600');
    messagesTab.classList.remove('tab-active');
    messagesTab.classList.add('text-gray-600');
    subscribersContent.classList.remove('hidden');
    messagesContent.classList.add('hidden');
  });

  messagesTab.addEventListener('click', () => {
    messagesTab.classList.add('tab-active');
    messagesTab.classList.remove('text-gray-600');
    messagesTab.classList.add('text-indigo-600');
    subscribersTab.classList.remove('tab-active');
    subscribersTab.classList.add('text-gray-600');
    messagesContent.classList.remove('hidden');
    subscribersContent.classList.add('hidden');
  });

  // Load subscribers from localStorage
  let subscribers = [];
  let selectedSubscribers = [];

  function loadSubscribers() {
    const storedUsers = localStorage.getItem('users');
    subscribers = storedUsers ? JSON.parse(storedUsers) : [];
    console.log(subscribers, "dsvssdfv dfv");
    
    renderSubscribers(subscribers);
    updateSubscriberCount();
  }

  // Render subscribers list
  function renderSubscribers(subscribersToRender) {
    if (subscribersToRender.length === 0) {
      subscribersList.innerHTML = `
            <div class="text-center py-8">
              <i class="fas fa-user-slash text-2xl text-gray-400"></i>
              <p class="mt-2 text-gray-500">No subscribers found</p>
            </div>
          `;
      return;
    }

    subscribersList.innerHTML = subscribersToRender.map((subscriber, index) => `
          <div class="user-card bg-white p-4 rounded-lg shadow-sm">
            <div class="flex items-start">
              <input type="checkbox" id="subscriber-${index}" value="${index}" 
                     class="checkbox-item hidden" ${selectedSubscribers.includes(index) ? 'checked' : ''}>
              <label for="subscriber-${index}" class="checkbox-label flex-1 flex items-start cursor-pointer">
                <div class="mr-3 mt-1">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <i class="fas fa-user"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h4 class="font-medium text-gray-800">${subscriber.name}</h4>
                    <span class="text-xs ${subscriber.alerts ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-2 py-1 rounded-full">
                      ${subscriber.alerts ? 'Alerts ON' : 'Alerts OFF'}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">
                    <i class="fas fa-phone mr-1"></i> ${subscriber.phone}
                  </p>
                  <p class="text-sm text-gray-600">
                    <i class="fas fa-map-marker-alt mr-1"></i> ${subscriber.location}
                  </p>
                </div>
              </label>
            </div>
          </div>
        `).join('');

    // Add event listeners to checkboxes
    document.querySelectorAll('.checkbox-item').forEach(checkbox => {
      checkbox.addEventListener('change', updateSelectedCount);
    });

    // Add click handlers for the labels
    document.querySelectorAll('.checkbox-label').forEach(label => {
      label.addEventListener('click', function (e) {
        // Prevent double triggering when clicking on nested elements
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;

        const checkbox = this.previousElementSibling;
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      });
    });
  }

  // Update subscriber count
  function updateSubscriberCount() {
    subscriberCount.textContent = `${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}`;
  }

  // Update selected count
  function updateSelectedCount() {
    selectedSubscribers = Array.from(document.querySelectorAll('.checkbox-item:checked'))
      .map(checkbox => parseInt(checkbox.value));

    selectedCount.textContent = `${selectedSubscribers.length} selected`;

    // Enable/disable buttons based on selection
    const hasSelection = selectedSubscribers.length > 0;
    previewBtn.disabled = !hasSelection;
    sendBtn.disabled = !hasSelection;
  }

  // Search functionality
  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filtered = subscribers.filter(subscriber =>
      subscriber.name.toLowerCase().includes(searchTerm) ||
      subscriber.phone.toLowerCase().includes(searchTerm) ||
      subscriber.location.toLowerCase().includes(searchTerm)
    );
    renderSubscribers(filtered);
  });

  // Select all/deselect all
  selectAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.checkbox-item').forEach(checkbox => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
    });
  });

  deselectAllBtn.addEventListener('click', function () {
    document.querySelectorAll('.checkbox-item').forEach(checkbox => {
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
    });
  });

  // Preview message
  previewBtn.addEventListener('click', function () {
    if (selectedSubscribers.length === 0) return;

    // Update preview content
    previewType.textContent = messageType.options[messageType.selectedIndex].text;
    previewSubject.textContent = messageSubject.value || "No subject";
    previewContent.textContent = messageContent.value || "No message content";

    // Update recipients list
    previewRecipients.innerHTML = selectedSubscribers.map(index => {
      const subscriber = subscribers[index];
      return `
            <div class="flex items-center bg-white p-2 rounded border">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                <i class="fas fa-user text-xs"></i>
              </div>
              <div>
                <p class="text-sm font-medium">${subscriber.name}</p>
                <p class="text-xs text-gray-500">${subscriber.phone}</p>
              </div>
            </div>
          `;
    }).join('');

    // Show modal
    previewModal.classList.remove('hidden');
  });

  // Close preview modal
  closePreview.addEventListener('click', function () {
    previewModal.classList.add('hidden');
  });

  cancelSendBtn.addEventListener('click', function () {
    previewModal.classList.add('hidden');
  });

  // Send message
  sendBtn.addEventListener('click', async function () {

    const message = messageContent.value.trim();
    if (!message) {
      showStatus('Message content is empty.', 'error');
      return;
    }

    const phoneNumbers = selectedSubscribers.map(index => subscribers[index].phone);

    try {
      // Send SMS using Africa's Talking API
      const response = await sendSMS(phoneNumbers, message).then(res => console.log(res.json())).catch(err => console.log(err));

      showStatus(`Successfully sent alert to ${phoneNumbers.length} subscriber${phoneNumbers.length !== 1 ? 's' : ''}`, 'success');

      // Hide modal and reset form
      previewModal.classList.add('hidden');
      messageSubject.value = '';
      messageContent.value = '';

      // Deselect all
      document.querySelectorAll('.checkbox-item').forEach(checkbox => {
        checkbox.checked = false;
      });
      updateSelectedCount();

      console.log('API Response:', response);
    } catch (error) {
      console.log(error);

      showStatus('Failed to send messages. Please try again.', 'error');
    }
  });

  confirmSendBtn.addEventListener('click', async function () {

    const message = messageContent.value.trim();
    if (!message) {
      showStatus('Message content is empty.', 'error');
      return;
    }

    const phoneNumbers = selectedSubscribers.map(index => subscribers[index].phone);

    try {
      // Send SMS using Africa's Talking API
      const response = await sendSMS(phoneNumbers, message).then(res => console.log(res.json())).catch(err => console.log(err));

      showStatus(`Successfully sent alert to ${phoneNumbers.length} subscriber${phoneNumbers.length !== 1 ? 's' : ''}`, 'success');

      // Hide modal and reset form
      previewModal.classList.add('hidden');
      messageSubject.value = '';
      messageContent.value = '';

      // Deselect all
      document.querySelectorAll('.checkbox-item').forEach(checkbox => {
        checkbox.checked = false;
      });
      updateSelectedCount();

      console.log('API Response:', response);
    } catch (error) {
      console.log(error);

      showStatus('Failed to send messages. Please try again.', error);
    }
  });

  // Show status message
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `message-box show mt-6 p-4 rounded-lg border text-center ${type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
      type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
        'bg-blue-50 text-blue-700 border-blue-200'
      }`;

    setTimeout(() => {
      statusMessage.classList.remove('show');
      setTimeout(() => {
        statusMessage.classList.add('hidden');
      }, 500);
    }, 5000);
  }

  // Initialize
  loadSubscribers();

  // Update alert type styling
  messageType.addEventListener('change', function () {
    const type = this.value;
    const colors = {
      general: 'bg-indigo-100 text-indigo-800',
      warning: 'bg-yellow-100 text-yellow-800',
      alert: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };
    previewType.className = `px-2 py-1 text-xs font-semibold rounded ${colors[type]}`;
  });
});