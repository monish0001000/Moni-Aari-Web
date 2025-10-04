let currentStep = 1;
const totalSteps = 4;
let orderFormData = {};

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initOrderForm();
    prefillUserData();
});

// ✅ Check login before placing order
function checkLoginStatus() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Please login to place an order');
        window.location.href = 'login.html';
        return;
    }

    const placeOrderNav = document.getElementById('placeOrderNav');
    if (placeOrderNav) {
        placeOrderNav.style.display = 'block';
    }
}

function getCurrentUser() {
    const userStr = localStorage.getItem('moniAariCurrentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// ✅ Initialize form steps & buttons
function initOrderForm() {
    const serviceSelect = document.getElementById('serviceSelect');
    const step1Next = document.getElementById('step1Next');

    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            step1Next.disabled = !this.value;
        });
    }

    if (step1Next) {
        step1Next.addEventListener('click', function() {
            if (validateStep(1)) {
                goToStep(2);
            }
        });
    }

    const nextButtons = document.querySelectorAll('[data-next-step]');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    const prevButtons = document.querySelectorAll('[data-prev-step]');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            goToStep(currentStep - 1);
        });
    });

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleOrderSubmit();
        });
    }
}

// ✅ Pre-fill name/email from login data
function prefillUserData() {
    const currentUser = getCurrentUser();

    if (currentUser) {
        const nameField = document.getElementById('orderName');
        const emailField = document.getElementById('orderEmail');

        if (nameField) nameField.value = currentUser.name || '';
        if (emailField) emailField.value = currentUser.email || '';
    }
}

// ✅ Step Navigation
function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const nextFormStep = document.querySelector(`.form-step[data-step="${step}"]`);

    if (currentFormStep) currentFormStep.classList.remove('active');
    if (nextFormStep) nextFormStep.classList.add('active');

    const currentProgressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
    const nextProgressStep = document.querySelector(`.progress-step[data-step="${step}"]`);

    if (currentProgressStep) {
        currentProgressStep.classList.remove('active');
        if (step > currentStep) {
            currentProgressStep.classList.add('completed');
        }
    }

    if (nextProgressStep) {
        nextProgressStep.classList.add('active');
    }

    currentStep = step;

    if (step === 4) {
        updateReviewSummary();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ✅ Step Validation
function validateStep(step) {
    const formStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!formStep) return false;

    const requiredFields = formStep.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#f44336';

            setTimeout(() => {
                field.style.borderColor = '';
            }, 2000);
        } else {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields');
    }

    return isValid;
}

// ✅ Update Review Summary (Step 4)
function updateReviewSummary() {
    const formData = {
        service: document.getElementById('serviceSelect').value,
        name: document.getElementById('orderName').value,
        email: document.getElementById('orderEmail').value,
        phone: document.getElementById('orderPhone').value,
        deadline: document.getElementById('deadline').value,
        designRequirements: document.getElementById('designRequirements').value,
        fabricType: document.getElementById('fabricType').value,
        colorPreference: document.getElementById('colorPreference').value,
        embroideryStyle: document.getElementById('embroideryStyle').value,
        measurements: document.getElementById('measurements').value || 'Not provided'
    };

    // 🧾 Display review values
    document.getElementById('reviewService').textContent = formData.service;
    document.getElementById('reviewName').textContent = formData.name;
    document.getElementById('reviewEmail').textContent = formData.email;
    document.getElementById('reviewPhone').textContent = formData.phone;
    document.getElementById('reviewDeadline').textContent = formData.deadline
        ? new Date(formData.deadline).toLocaleDateString()
        : '-';
    document.getElementById('reviewImage').textContent = 'No image uploaded';
    document.getElementById('reviewDesign').textContent = formData.designRequirements;
    document.getElementById('reviewFabric').textContent = formData.fabricType;
    document.getElementById('reviewColor').textContent = formData.colorPreference;
    document.getElementById('reviewStyle').textContent = formData.embroideryStyle;
    document.getElementById('reviewMeasurements').textContent = formData.measurements;

    orderFormData = formData;
}

// ✅ Handle Final Submit
async function handleOrderSubmit() {
    const messageDiv = document.getElementById('orderFormMessage');

    try {
        await sendCustomOrderToTelegram(orderFormData);

        showOrderMessage(
            messageDiv,
            '✅ Your custom order has been submitted successfully! We will contact you soon.',
            'success'
        );

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);

    } catch (error) {
        showOrderMessage(messageDiv, '⚠️ An error occurred. Please try again.', 'error');
    }
}

// ✅ Send Data to Telegram Bot
async function sendCustomOrderToTelegram(formData) {
    const TELEGRAM_BOT_TOKEN = '8251796240:AAGPRIAZH50aUl6Vlmtu1ZKOFmANOiH2lYc';
    const TELEGRAM_CHAT_ID = '5932177382';

    const text = `
🧵 *New Custom Order Submission* 🧵

👤 Name: ${formData.name}
📧 Email: ${formData.email}
📞 Phone: ${formData.phone}
🎨 Service: ${formData.service}
📅 Deadline: ${formData.deadline}

📌 *Specifications:*
🧵 Design: ${formData.designRequirements}
🪡 Fabric: ${formData.fabricType}
🎨 Color: ${formData.colorPreference}
💎 Style: ${formData.embroideryStyle}
📏 Measurements: ${formData.measurements}
`;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send order');
    }
}

// ✅ Display Status Message
function showOrderMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `form-message ${type}`;
    }
}
