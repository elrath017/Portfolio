/**
 * Antigravity Data Science & AI Engineer Portfolio
 * Client-side Interactivity & Admin Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initCategoryFilter();
  initScrollReveal();
  initMobileNav();
  initAdminAuth();
  initAdminTabs();
  initChatbot();
  initFooterObserver();
});

/* -----------------------------------------------------------------------------
   Toast Notifications
   ----------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `
    <span style="font-weight: bold; color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'}">${icon}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('active');
  });

  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* -----------------------------------------------------------------------------
   1. Theme Toggle (Light / Dark)
   ----------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  setTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio_theme', theme);
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* -----------------------------------------------------------------------------
   2. Typewriter / Subtitle Rotator
   ----------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const phrases = [
    "AI Engineer",
    "Data Scientist",
    "LLM & RAG Architect",
    "Computer Vision Specialist",
    "MLOps Engineer"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* -----------------------------------------------------------------------------
   3. Category Filtering
   ----------------------------------------------------------------------------- */
function initCategoryFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterTabs.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categorySlug = card.getAttribute('data-category-slug');

        if (filterValue === 'all' || categorySlug === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* -----------------------------------------------------------------------------
   4. Scroll Reveal Animations
   ----------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(el => observer.observe(el));
}

/* -----------------------------------------------------------------------------
   5. Mobile Navigation
   ----------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking nav links
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/* -----------------------------------------------------------------------------
   6. Admin Authentication & Controls
   ----------------------------------------------------------------------------- */
function initAdminAuth() {
  const adminTrigger = document.getElementById('adminTrigger');
  const loginModal = document.getElementById('adminLoginModal');
  const loginForm = document.getElementById('adminLoginForm');
  const cancelLoginBtn = document.getElementById('cancelLoginBtn');
  const adminDrawerOverlay = document.getElementById('adminDrawerOverlay');
  const adminDrawer = document.getElementById('adminDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  // Check initial admin status
  fetch('/admin/status')
    .then(res => res.json())
    .then(data => {
      if (data.authenticated && adminTrigger) {
        adminTrigger.textContent = "⚡ Admin Drawer";
      }
    }).catch(() => {});

  if (adminTrigger) {
    adminTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      fetch('/admin/status')
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            openDrawer();
          } else if (loginModal) {
            loginModal.classList.add('active');
          }
        });
    });
  }

  if (cancelLoginBtn && loginModal) {
    cancelLoginBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('adminPasswordInput').value;

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'fetch'
          },
          body: JSON.stringify({ password })
        });

        const data = await response.json();
        if (response.ok) {
          loginModal.classList.remove('active');
          document.getElementById('adminPasswordInput').value = '';
          showToast('Authenticated as Admin', 'success');
          if (adminTrigger) adminTrigger.textContent = "⚡ Admin Drawer";
          openDrawer();
        } else {
          showToast(data.error || 'Authentication failed', 'error');
        }
      } catch (err) {
        showToast('Network error during login', 'error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/logout', { 
          method: 'POST',
          headers: { 'X-Requested-With': 'fetch' }
        });
        showToast('Logged out of admin mode', 'info');
        closeDrawer();
        if (adminTrigger) adminTrigger.textContent = "Admin";
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        showToast('Error logging out', 'error');
      }
    });
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (adminDrawerOverlay) adminDrawerOverlay.addEventListener('click', closeDrawer);

  function openDrawer() {
    if (adminDrawerOverlay) adminDrawerOverlay.classList.add('active');
    if (adminDrawer) adminDrawer.classList.add('active');
  }

  function closeDrawer() {
    if (adminDrawerOverlay) adminDrawerOverlay.classList.remove('active');
    if (adminDrawer) adminDrawer.classList.remove('active');
  }
}

/* -----------------------------------------------------------------------------
   7. Admin Tabs & CRUD Operations
   ----------------------------------------------------------------------------- */
function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Profile Form Handler
  const profileForm = document.getElementById('adminProfileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('profName').value,
        headline: document.getElementById('profHeadline').value,
        bio: document.getElementById('profBio').value,
        github: document.getElementById('profGithub').value,
        linkedin: document.getElementById('profLinkedin').value,
        email: document.getElementById('profEmail').value,
        location: document.getElementById('profLocation').value,
        avatar_url: document.getElementById('profAvatar') ? document.getElementById('profAvatar').value : ''
      };

      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'fetch'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
          showToast(data.message || 'Profile saved', 'success');
          setTimeout(() => location.reload(), 800);
        } else {
          showToast(data.error || 'Failed to save profile', 'error');
        }
      } catch (err) {
        showToast('Network error saving profile', 'error');
      }
    });
  }

  // Add Project Form Handler
  const projectForm = document.getElementById('adminProjectForm');
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        title: document.getElementById('projTitle').value,
        category_id: parseInt(document.getElementById('projCategory').value, 10),
        description: document.getElementById('projDescription').value,
        tech_stack: document.getElementById('projTech').value,
        project_url: document.getElementById('projUrl').value,
        github_url: document.getElementById('projGithub').value,
        image_url: document.getElementById('projImage').value
      };

      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'fetch'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Project created successfully', 'success');
          projectForm.reset();
          setTimeout(() => location.reload(), 800);
        } else {
          showToast(data.error || 'Failed to create project', 'error');
        }
      } catch (err) {
        showToast('Network error creating project', 'error');
      }
    });
  }

  // Delete Project Handler
  document.querySelectorAll('.btn-delete-project').forEach(btn => {
    btn.addEventListener('click', async () => {
      const projId = btn.getAttribute('data-id');
      const projTitle = btn.getAttribute('data-title');
      if (!confirm(`Are you sure you want to delete project "${projTitle}"?`)) return;

      try {
        const res = await fetch(`/api/projects/${projId}`, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'fetch' }
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Project deleted', 'success');
          setTimeout(() => location.reload(), 600);
        } else {
          showToast(data.error || 'Failed to delete project', 'error');
        }
      } catch (err) {
        showToast('Network error deleting project', 'error');
      }
    });
  });

  // Add Category Form Handler
  const categoryForm = document.getElementById('adminCategoryForm');
  if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('catName').value;

      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'fetch'
          },
          body: JSON.stringify({ name })
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Category added', 'success');
          categoryForm.reset();
          setTimeout(() => location.reload(), 800);
        } else {
          showToast(data.error || 'Failed to add category', 'error');
        }
      } catch (err) {
        showToast('Network error adding category', 'error');
      }
    });
  }

  // Delete Category Handler
  document.querySelectorAll('.btn-delete-category').forEach(btn => {
    btn.addEventListener('click', async () => {
      const catId = btn.getAttribute('data-id');
      const catName = btn.getAttribute('data-name');
      if (!confirm(`Delete category "${catName}"?`)) return;

      try {
        const res = await fetch(`/api/categories/${catId}`, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'fetch' }
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Category deleted', 'success');
          setTimeout(() => location.reload(), 600);
        } else {
          // Display server restriction message if category has projects attached
          showToast(data.error || 'Failed to delete category', 'error');
        }
      } catch (err) {
        showToast('Network error deleting category', 'error');
      }
    });
  });

  // Add Skill Form Handler
  const skillForm = document.getElementById('adminSkillForm');
  if (skillForm) {
    skillForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const category = document.getElementById('skillCategory').value;
      const name = document.getElementById('skillName').value;

      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'fetch'
          },
          body: JSON.stringify({ category, name })
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Skill added', 'success');
          skillForm.reset();
          setTimeout(() => location.reload(), 600);
        } else {
          showToast(data.error || 'Failed to add skill', 'error');
        }
      } catch (err) {
        showToast('Network error adding skill', 'error');
      }
    });
  }

  // Delete Skill Handler
  document.querySelectorAll('.btn-remove-skill').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const skillId = btn.getAttribute('data-id');
      
      try {
        const res = await fetch(`/api/skills/${skillId}`, {
          method: 'DELETE',
          headers: { 'X-Requested-With': 'fetch' }
        });
        const data = await res.json();

        if (res.ok) {
          showToast('Skill removed', 'success');
          const tag = btn.closest('.skill-tag');
          if (tag) tag.remove();
        } else {
          showToast(data.error || 'Failed to remove skill', 'error');
        }
      } catch (err) {
        showToast('Network error removing skill', 'error');
      }
    });
  });
}

/* -----------------------------------------------------------------------------
   8. Gemini AI Chatbot Interface
   ----------------------------------------------------------------------------- */
function initChatbot() {
  const triggerBtn = document.getElementById('chatWidgetTrigger');
  const chatPanel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('closeChatBtn');
  const sendBtn = document.getElementById('sendChatBtn');
  const chatInput = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  const chipBtns = document.querySelectorAll('.chat-chip');

  if (!triggerBtn || !chatPanel) return;

  let chatHistory = [];

  triggerBtn.addEventListener('click', () => {
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active') && chatInput) {
      chatInput.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatPanel.classList.remove('active');
    });
  }

  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-question');
      if (text && chatInput) {
        chatInput.value = text;
        sendMessage();
      }
    });
  });

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message bubble
    appendBubble(text, 'user');
    chatHistory.push({ role: 'user', content: text });
    chatInput.value = '';

    // Render typing indicator
    const typingElem = renderTypingIndicator();
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await response.json();
      removeTypingIndicator(typingElem);

      if (response.ok && data.reply) {
        appendBubble(data.reply, 'ai');
        chatHistory.push({ role: 'model', content: data.reply });
      } else {
        const errorMsg = data.error || 'Sorry, I am unable to connect to AI services right now.';
        appendBubble(errorMsg, 'ai');
      }
    } catch (err) {
      removeTypingIndicator(typingElem);
      appendBubble('Network error. Please try asking again.', 'ai');
    }

    scrollToBottom();
  }

  function appendBubble(content, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble-${sender}`;
    // Secure text escaping & basic linebreaks
    bubble.innerHTML = escapeHTML(content).replace(/\n/g, '<br>');
    messagesContainer.appendChild(bubble);
  }

  function renderTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    messagesContainer.appendChild(indicator);
    return indicator;
  }

  function removeTypingIndicator(elem) {
    if (elem && elem.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

/* -----------------------------------------------------------------------------
   9. Footer Scroll Observer for Floating AI Chat Widget
   ----------------------------------------------------------------------------- */
function initFooterObserver() {
  const footer = document.querySelector('.footer');
  const triggerBtn = document.getElementById('chatWidgetTrigger');
  
  if (!footer || !triggerBtn) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.classList.add('footer-visible');
      } else {
        document.body.classList.remove('footer-visible');
      }
    });
  }, {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0.05
  });

  observer.observe(footer);
}
