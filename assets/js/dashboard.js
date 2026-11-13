/**
 * dashboard.js - TowGuard Customer Dispatch Portal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initDashboardSidebar();
  initTopbarProfile();
  initSectionJumps();
  initDispatchChat();
});

/* Topbar profile button jumps to the Settings section */
function initTopbarProfile() {
  const profile = document.querySelector('.topbar-profile');
  const settingsLink = document.querySelector('.sidebar-nav-link[data-target="settings"]');
  if (!profile || !settingsLink) return;

  profile.addEventListener('click', () => settingsLink.click());
}

/* In-page shortcuts (e.g. the welcome banner) reuse the sidebar tab logic */
function initSectionJumps() {
  document.querySelectorAll('.dash-jump').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const link = document.querySelector('.sidebar-nav-link[data-target="' + el.dataset.target + '"]');
      if (link) link.click();
    });
  });
}

function initDashboardTabs() {
  const navLinks = document.querySelectorAll('.sidebar-nav-link');
  const sections = document.querySelectorAll('.dashboard-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');

      // no data-target means it is a real link (Logout) - let it navigate
      if (!targetId || targetId === 'logout') return;

      e.preventDefault();
      
      // Update active nav
      navLinks.forEach(n => n.classList.remove('active'));
      link.classList.add('active');

      // Update active section
      sections.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
      });
      
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
      }
      
      // Close sidebar on mobile after click
      if (window.innerWidth <= 1024) {
        document.querySelector('.dashboard-sidebar').classList.remove('open');
        document.querySelector('.dashboard-overlay').classList.remove('open');
      }

      // A new section always starts at the top, never at the old scroll offset.
      // 'instant' overrides the page-wide `html { scroll-behavior: smooth }`,
      // which would otherwise animate the whole way back up.
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  });
}

function initDashboardSidebar() {
  const toggleBtn = document.querySelector('.dashboard-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const overlay = document.querySelector('.dashboard-overlay');
  const closeBtn = document.querySelector('.sidebar-close');

  function openSidebar() {
    if(sidebar && overlay) {
      sidebar.classList.add('open');
      overlay.classList.add('open');
    }
  }

  function closeSidebar() {
    if(sidebar && overlay) {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);
}

/* Dispatch live chat quick reply */
function initDispatchChat() {
  const container = document.querySelector('#messages .chat-container');
  const input = document.querySelector('#messages input[type="text"]');
  const sendBtn = document.querySelector('#messages button.btn-primary');
  if (!container || !input || !sendBtn) return;

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble sent';
    bubble.innerHTML = `<p style="margin: 0; font-size: 14px;"></p><span style="font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 4px; display: block;">You &bull; Just now</span>`;
    bubble.querySelector('p').textContent = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    input.value = '';
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
}
