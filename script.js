/* =========================================
   PARTICLES & UI SETUP
   ========================================= */
   if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#00d4ff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#00d4ff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Timeline Animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.2 });
document.querySelectorAll('.timeline-item').forEach(item => timelineObserver.observe(item));

// Contact Form
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        try {
            const response = await fetch('https://formsubmit.co/ajax/dimlakylejustine@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                successMessage.style.display = 'block';
                contactForm.reset();
                setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
            }
        } catch (error) {
            alert('Message sent! Thank you.');
            contactForm.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Skills Carousel Loop
const skillsTrack = document.getElementById('skillsTrack');
if (skillsTrack) {
    const skills = Array.from(skillsTrack.children);
    skills.forEach(skill => skillsTrack.appendChild(skill.cloneNode(true)));
}

// 3D & Parallax Effects
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.shape').forEach((shape, index) => {
        const speed = (index + 1) * 20;
        shape.style.transform = `translate(${(e.clientX/window.innerWidth - 0.5) * speed}px, ${(e.clientY/window.innerHeight - 0.5) * speed}px)`;
    });
});
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.transform = `perspective(1000px) rotateX(${((e.clientY - rect.top) - rect.height/2)/20}deg) rotateY(${((rect.width/2) - (e.clientX - rect.left))/20}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)');
});

// Scroll Active Link
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        if (scrollY >= (section.offsetTop - 200)) current = section.getAttribute('id');
    });
    const navList = document.getElementById('navLinks');
    if (navList) {
        navList.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) link.classList.add('active');
        });
    }
});

/* =========================================
   FLOATING AI CHAT & LOGIC
   ========================================= */

// ⚠️ PASTE YOUR API KEY HERE ⚠️
const API_KEY = 'AIzaSyAfMtYrra3tIdaTTD8jwunA_awO89ZSnBc'; 

const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');
const chatContainer = document.getElementById('chatContainer');
const chatToggleBtn = document.getElementById('chatToggleBtn');
const closeChatBtn = document.getElementById('closeChatBtn');

// Toggle Chat Visibility
if (chatToggleBtn && chatContainer) {
    chatToggleBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
        }
    });
}

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
}

let cachedModelUrl = null;

// Context Loader
function getWebsiteContext() {
    const sections = ['about', 'experience', 'projects', 'skills', 'education'];
    let context = "You are the AI representative for Kyle Justine C. Dimla. \n\n" +
    "INSTRUCTIONS:\n" +
    "1. Answer strictly based on the resume below.\n" +
    "2. Be Systematic: Use bullet points for lists. Use bold text for key skills or tools.\n" +
    "3. Be Professional: Answer on Kyle's behalf. Keep it concise but informative.\n" +
    "4. Formatting: If listing projects or skills, separate them with line breaks.\n" +
    "\n--- RESUME DATA ---\n";

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            context += `[${id.toUpperCase()}]\n${el.innerText.replace(/\s+/g, ' ').trim()}\n\n`;
        }
    });
    return context;
}

// Text Formatter
function formatBotResponse(text) {
    let clean = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    clean = clean.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    clean = clean.replace(/^\s*[\-\*]\s+(.*)$/gm, '• $1');
    return clean;
}

// UI Helper
function addMessage(text, isUser, type = '') {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user' : 'bot'} ${type}`;
    
    if (isUser || type === 'loading') {
        div.textContent = text;
    } else {
        div.innerHTML = formatBotResponse(text);
    }
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

// Auto-Discovery Model
async function findWorkingModel() {
    if (cachedModelUrl) return cachedModelUrl;

    const cleanKey = API_KEY.trim();
    if (cleanKey === 'PASTE_YOUR_API_KEY_HERE' || !cleanKey) throw new Error("Missing API Key");

    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
    
    try {
        const response = await fetch(listUrl);
        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);
        if (!data.models) throw new Error("No models found.");

        const viableModels = data.models
            .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
            .map(m => m.name);

        let bestModel = viableModels.find(m => m.includes('flash')) || 
                        viableModels.find(m => m.includes('pro')) || 
                        viableModels[0];

        if (!bestModel) throw new Error("No chat-capable models available.");

        bestModel = bestModel.replace('models/', '');
        cachedModelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${bestModel}:generateContent?key=${cleanKey}`;
        return cachedModelUrl;

    } catch (err) {
        throw err;
    }
}

// Send Message
async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';
    const loading = addMessage('Thinking...', false, 'loading');

    try {
        const apiUrl = await findWorkingModel();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: getWebsiteContext() + "\nUser Question: " + text + "\nAnswer:" }]
                }]
            })
        });

        const data = await response.json();
        chatMessages.removeChild(loading);

        if (data.error) {
            addMessage(`Error: ${data.error.message}`, false);
        } else {
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
            addMessage(reply, false);
        }

    } catch (error) {
        chatMessages.removeChild(loading);
        if (error.message === "Missing API Key") {
            addMessage("⚠️ Error: Please paste your API Key in script.js", false);
        } else {
            addMessage("System Error: Unable to connect to Google AI. Please check your internet or API Key permissions.", false);
        }
    }
}

// Chat Listeners
if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}