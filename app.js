/* =============================================
   ANEGIS WWW Project Tracker — Application Logic
   With Google Sheets Integration
   ============================================= */

// ============================================
// CONFIGURATION — Google Sheets API
// ============================================

// >> WKLEJ TUTAJ URL WDROŻENIA GOOGLE APPS SCRIPT <<
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQAr-Vk2xk3l7xgI2shMtPwEK1SuGV3ZSKFjz6Qza31ds6JP5_-BJdac5eNZr50Nfu/exec';

// ============================================
// DATA — from the Google Spreadsheet (fallback defaults)
// ============================================

let MILESTONES = [
    { id: 'M1', name: 'Homepage', start: '2026-03-02', deadline: '2026-03-06', category: 'HOME' },
    { id: 'M2', name: 'Co robimy (Obszary)', start: '2026-03-02', deadline: '2026-03-13', category: 'CO ROBIMY' },
    { id: 'M3', name: 'Rozwiązania Microsoft', start: '2026-03-16', deadline: '2026-04-03', category: 'MICROSOFT' },
    { id: 'M4', name: 'Rozwiązania Autorskie', start: '2026-04-06', deadline: '2026-04-24', category: 'AUTORSKIE' },
    { id: 'M5', name: 'Usługi', start: '2026-04-27', deadline: '2026-05-15', category: 'USŁUGI' },
    { id: 'M6', name: 'Branże', start: '2026-05-18', deadline: '2026-05-22', category: 'BRANŻE' },
    { id: 'M7', name: 'Case Studies', start: '2026-05-18', deadline: '2026-05-24', category: 'CASE STUDIES' },
    { id: 'M8', name: 'Wiedza (Eventy, Artykuły itp.)', start: '2026-05-25', deadline: '2026-06-05', category: 'WIEDZA' },
    { id: 'M9', name: 'O nas', start: '2026-06-08', deadline: '2026-06-14', category: 'O NAS' },
];

const DEFAULT_TASKS = [
    // M1 — HOME
    { id: 't1', milestone: 'M1', category: 'HOME', name: 'Strona Główna (HOMEPAGE)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P0' },

    // M2 — CO ROBIMY
    { id: 't2', milestone: 'M2', category: 'CO ROBIMY', name: 'Finanse i compliance', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't3', milestone: 'M2', category: 'CO ROBIMY', name: 'Sprzedaż i marketing', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't4', milestone: 'M2', category: 'CO ROBIMY', name: 'Łańcuch dostaw i produkcja', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't5', milestone: 'M2', category: 'CO ROBIMY', name: 'HR i kadry', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't6', milestone: 'M2', category: 'CO ROBIMY', name: 'Analityka i raportowanie', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't7', milestone: 'M2', category: 'CO ROBIMY', name: 'Automatyzacja procesów', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't8', milestone: 'M2', category: 'CO ROBIMY', name: 'Sztuczna inteligencja', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },

    // M3 — MICROSOFT
    { id: 't9', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Finance', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't10', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Supply Chain Management', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't11', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Sales (CRM)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't12', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Customer Service', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't13', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Commerce', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't14', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Human Resources', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't15', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Project Operations', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't16', milestone: 'M3', category: 'MICROSOFT', name: 'Dynamics 365 Business Central', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't17', milestone: 'M3', category: 'MICROSOFT', name: 'Power BI', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't18', milestone: 'M3', category: 'MICROSOFT', name: 'Power Apps', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't19', milestone: 'M3', category: 'MICROSOFT', name: 'Power Automate', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't20', milestone: 'M3', category: 'MICROSOFT', name: 'Copilot Studio', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't21', milestone: 'M3', category: 'MICROSOFT', name: 'Azure (ogólna)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't22', milestone: 'M3', category: 'MICROSOFT', name: 'Microsoft 365 / Copilot for M365', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't23', milestone: 'M3', category: 'MICROSOFT', name: 'Microsoft Fabric', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },

    // M4 — AUTORSKIE
    { id: 't24', milestone: 'M4', category: 'AUTORSKIE', name: 'Cost Allocation', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't25', milestone: 'M4', category: 'AUTORSKIE', name: 'KSeF (e-Faktury)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't26', milestone: 'M4', category: 'AUTORSKIE', name: 'JPK (Jednolity Plik Kontrolny)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't27', milestone: 'M4', category: 'AUTORSKIE', name: 'Polish Localization Pack', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't28', milestone: 'M4', category: 'AUTORSKIE', name: 'Deklaracje podatkowe (CIT/PIT)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't29', milestone: 'M4', category: 'AUTORSKIE', name: 'AI Quality Inspector', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't30', milestone: 'M4', category: 'AUTORSKIE', name: 'Copilot for D365 (rozszerzenia)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },

    // M5 — USŁUGI
    { id: 't31', milestone: 'M5', category: 'USŁUGI', name: 'Wdrożenie ERP', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't32', milestone: 'M5', category: 'USŁUGI', name: 'Wdrożenie CRM', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't33', milestone: 'M5', category: 'USŁUGI', name: 'Rozwój i optymalizacja', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't34', milestone: 'M5', category: 'USŁUGI', name: 'Migracja do chmury', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't35', milestone: 'M5', category: 'USŁUGI', name: 'Wsparcie i SLA', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't36', milestone: 'M5', category: 'USŁUGI', name: 'Diagnoza przedwdrożeniowa', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't37', milestone: 'M5', category: 'USŁUGI', name: 'Szkolenia', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't38', milestone: 'M5', category: 'USŁUGI', name: 'Zarządzanie zmianą', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't39', milestone: 'M5', category: 'USŁUGI', name: 'Integracje systemowe', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't40', milestone: 'M5', category: 'USŁUGI', name: 'Analityka i BI', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },

    // M6 — BRANŻE
    { id: 't41', milestone: 'M6', category: 'BRANŻE', name: 'Produkcja', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't42', milestone: 'M6', category: 'BRANŻE', name: 'Handel i dystrybucja', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't43', milestone: 'M6', category: 'BRANŻE', name: 'Usługi profesjonalne / Inżynieria', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't44', milestone: 'M6', category: 'BRANŻE', name: 'Retail / e-Commerce', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },

    // M7 — CASE STUDIES
    { id: 't45', milestone: 'M7', category: 'CASE STUDIES', name: 'Case studies (Główna lista)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't46', milestone: 'M7', category: 'CASE STUDIES', name: 'Szablon Case Study', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't47', milestone: 'M7', category: 'CASE STUDIES', name: 'Referencje klientów', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },

    // M8 — WIEDZA
    { id: 't48', milestone: 'M8', category: 'WIEDZA', name: 'Artykuły (Blog)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P3' },
    { id: 't49', milestone: 'M8', category: 'WIEDZA', name: 'E-booki / Whitepapers', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P3' },
    { id: 't50', milestone: 'M8', category: 'WIEDZA', name: 'Webinary / Eventy', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P3' },
    { id: 't51', milestone: 'M8', category: 'WIEDZA', name: 'Podcasty', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P3' },
    { id: 't52', milestone: 'M8', category: 'WIEDZA', name: 'Newsletter', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P3' },

    // M9 — O NAS
    { id: 't53', milestone: 'M9', category: 'O NAS', name: 'O firmie', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P4' },
    { id: 't54', milestone: 'M9', category: 'O NAS', name: 'Zespół / Leadership', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P4' },
    { id: 't55', milestone: 'M9', category: 'O NAS', name: 'Kariera', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P4' },
    { id: 't56', milestone: 'M9', category: 'O NAS', name: 'Partnerzy / Certyfikaty', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P4' },
    { id: 't57', milestone: 'M9', category: 'O NAS', name: 'Aktualności', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P4' },

    // KONTAKT (extra, no milestone)
    { id: 't58', milestone: 'KONTAKT', category: 'KONTAKT', name: 'Kontakt (Formularz/Dane)', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
    { id: 't59', milestone: 'KONTAKT', category: 'KONTAKT', name: 'Mapa / Lokalizacja biur', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P2' },
    { id: 't60', milestone: 'KONTAKT', category: 'KONTAKT', name: 'Demo / Zapytanie ofertowe', copywriter: 'Brak', grafik: 'Brak', architekt: 'Brak', priority: 'P1' },
];

const DEFAULT_WORKLOG = [
    { id: 'w1', date: '2026-03-02', person: 'Copywriter', milestone: 'M1', hours: 8, comment: 'Teksty Home Page' },
    { id: 'w2', date: '2026-03-02', person: 'Grafik', milestone: 'M1', hours: 4, comment: 'Ikony sekcji Hero' },
];

// ============================================
// SYNC STATUS UI
// ============================================

function setSyncStatus(status, message) {
    const indicator = document.getElementById('sync-indicator');
    const icon = document.getElementById('sync-icon');
    const text = document.getElementById('sync-text');
    if (!indicator) return;

    indicator.className = 'sync-indicator ' + status;

    switch (status) {
        case 'syncing':
            icon.textContent = '🔄';
            text.textContent = message || 'Synchronizuję z Google Sheets...';
            break;
        case 'synced':
            icon.textContent = '✅';
            text.textContent = message || 'Zsynchronizowano z Google Sheets';
            break;
        case 'error':
            icon.textContent = '❌';
            text.textContent = message || 'Błąd synchronizacji';
            break;
        case 'offline':
            icon.textContent = '📴';
            text.textContent = message || 'Tryb offline (localStorage)';
            break;
        default:
            icon.textContent = '⏳';
            text.textContent = message || 'Łączenie z Google Sheets...';
    }
}

// ============================================
// GOOGLE SHEETS API
// ============================================

function isApiConfigured() {
    return APPS_SCRIPT_URL && APPS_SCRIPT_URL.length > 10;
}

async function apiGet() {
    if (!isApiConfigured()) return null;

    const response = await fetch(APPS_SCRIPT_URL + '?action=load');
    // Follow redirect from Apps Script
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'API error');
    return data;
}

async function apiPost(payload) {
    if (!isApiConfigured()) return null;

    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // Apps Script requires text/plain for CORS
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'API error');
    return data;
}

// ============================================
// STATE MANAGEMENT
// ============================================

const STORAGE_KEY = 'anegis-tracker-data';

function loadStateFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Could not load saved state:', e);
    }
    return {
        tasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
        worklog: JSON.parse(JSON.stringify(DEFAULT_WORKLOG)),
    };
}

function saveStateToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('Could not save state:', e);
    }
}

// Initial state from localStorage (fast first render)
let state = loadStateFromLocalStorage();

// Load from Google Sheets (async)
async function loadFromSheets() {
    if (!isApiConfigured()) {
        setSyncStatus('offline', 'Brak URL API — tryb offline');
        return;
    }

    setSyncStatus('syncing', 'Pobieranie danych z Google Sheets...');

    try {
        const data = await apiGet();
        if (data) {
            // Update milestones if available from spreadsheet
            if (data.milestones && data.milestones.length > 0) {
                // Merge spreadsheet milestones with local category data
                const categoryMap = {};
                MILESTONES.forEach(m => { categoryMap[m.id] = m.category; });

                MILESTONES = data.milestones.map(m => ({
                    ...m,
                    category: categoryMap[m.id] || m.name.toUpperCase(),
                }));
            }

            // Update tasks if available
            if (data.tasks && data.tasks.length > 0) {
                state.tasks = data.tasks;
            }

            // Update worklog
            state.worklog = data.worklog || [];

            saveStateToLocalStorage();
            renderAll();
            setSyncStatus('synced', 'Dane pobrane z Google Sheets');
        }
    } catch (error) {
        console.error('Failed to load from Google Sheets:', error);
        setSyncStatus('error', 'Błąd: ' + error.message);
    }
}

// Debounced sync to avoid too many API calls
let syncTimeout = null;

function scheduleSyncToSheets() {
    if (!isApiConfigured()) return;

    // Clear previous scheduled sync
    if (syncTimeout) clearTimeout(syncTimeout);

    setSyncStatus('syncing', 'Zapisuję zmiany...');

    // Debounce: wait 1 second before sending
    syncTimeout = setTimeout(async () => {
        try {
            await apiPost({
                action: 'saveAll',
                tasks: state.tasks,
                worklog: state.worklog,
            });
            setSyncStatus('synced');
        } catch (error) {
            console.error('Failed to sync to Google Sheets:', error);
            setSyncStatus('error', 'Błąd zapisu: ' + error.message);
        }
    }, 1000);
}

function saveState() {
    saveStateToLocalStorage();
    scheduleSyncToSheets();
}

// ============================================
// PROGRESS CALCULATION
// ============================================

const STATUS_WEIGHT = {
    'Gotowe': 1.0,
    'Do akceptacji': 0.8,
    'W trakcie': 0.5,
    'Brak': 0.0,
};

function calculateMilestoneProgress(milestoneId) {
    const tasks = state.tasks.filter(t => t.milestone === milestoneId);
    if (tasks.length === 0) return 0;

    let totalWeight = 0;
    let totalPossible = tasks.length * 3; // 3 roles per task

    tasks.forEach(task => {
        totalWeight += (STATUS_WEIGHT[task.copywriter] || 0);
        totalWeight += (STATUS_WEIGHT[task.grafik] || 0);
        totalWeight += (STATUS_WEIGHT[task.architekt] || 0);
    });

    return totalPossible > 0 ? totalWeight / totalPossible : 0;
}

function getMilestoneStatus(progress) {
    if (progress >= 1) return { text: 'UKOŃCZONE', class: 'status-gotowe' };
    if (progress > 0) return { text: 'W TRAKCIE', class: 'status-wtrakcie' };
    return { text: 'PLANOWANIE', class: 'status-planowanie' };
}

function getTimeliness(milestone, progress) {
    const today = new Date();
    const deadline = new Date(milestone.deadline);
    const start = new Date(milestone.start);

    if (progress >= 1) return { text: 'UKOŃCZONE', class: 'timeliness-ok', icon: '✅' };

    const totalDays = (deadline - start) / (1000 * 60 * 60 * 24);
    const elapsedDays = (today - start) / (1000 * 60 * 60 * 24);

    if (today > deadline && progress < 1) return { text: 'OPÓŹNIONE', class: 'timeliness-risk', icon: '🚨' };
    if (elapsedDays < 0) return { text: 'W TERMINIE', class: 'timeliness-ok', icon: '🟢' };

    const expectedProgress = Math.min(elapsedDays / totalDays, 1);
    if (progress < expectedProgress * 0.7) return { text: 'ZAGROŻONE', class: 'timeliness-risk', icon: '🚨' };
    if (progress < expectedProgress * 0.9) return { text: 'UWAGA', class: 'timeliness-warning', icon: '⚠️' };
    return { text: 'W TERMINIE', class: 'timeliness-ok', icon: '🟢' };
}

function getTaskStatusCounts(milestoneId) {
    const tasks = state.tasks.filter(t => t.milestone === milestoneId);
    const counts = { brak: 0, wtrakcie: 0, akceptacja: 0, gotowe: 0 };

    tasks.forEach(t => {
        [t.copywriter, t.grafik, t.architekt].forEach(s => {
            if (s === 'Brak') counts.brak++;
            else if (s === 'W trakcie') counts.wtrakcie++;
            else if (s === 'Do akceptacji') counts.akceptacja++;
            else if (s === 'Gotowe') counts.gotowe++;
        });
    });

    return counts;
}

// ============================================
// RENDERING — Dashboard
// ============================================

const CARD_COLORS = [
    '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'
];

function renderDashboard() {
    const grid = document.getElementById('milestone-grid');
    grid.innerHTML = '';

    MILESTONES.forEach((m, i) => {
        const progress = calculateMilestoneProgress(m.id);
        const status = getMilestoneStatus(progress);
        const timeliness = getTimeliness(m, progress);
        const counts = getTaskStatusCounts(m.id);
        const pct = Math.round(progress * 100);

        const card = document.createElement('div');
        card.className = 'milestone-card';
        card.style.setProperty('--card-accent', CARD_COLORS[i]);

        card.innerHTML = `
            <div class="card-header">
                <span class="card-id">${m.id}</span>
                <span class="card-timeliness ${timeliness.class}">${timeliness.icon} ${timeliness.text}</span>
            </div>
            <div class="card-title">${m.name}</div>
            <div class="card-dates">
                <span class="card-date"><strong>Start:</strong> ${formatDate(m.start)}</span>
                <span class="card-date"><strong>Deadline:</strong> ${formatDate(m.deadline)}</span>
            </div>
            <div class="progress-container">
                <div class="progress-header">
                    <span class="progress-label">Postęp</span>
                    <span class="progress-value">${pct}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%;" data-width="${pct}%"></div>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="card-status ${status.class}">${status.text}</span>
                <div class="card-task-summary">
                    ${counts.gotowe > 0 ? `<span class="task-dot"><span class="dot dot-gotowe"></span>${counts.gotowe}</span>` : ''}
                    ${counts.akceptacja > 0 ? `<span class="task-dot"><span class="dot dot-akceptacja"></span>${counts.akceptacja}</span>` : ''}
                    ${counts.wtrakcie > 0 ? `<span class="task-dot"><span class="dot dot-wtrakcie"></span>${counts.wtrakcie}</span>` : ''}
                    ${counts.brak > 0 ? `<span class="task-dot"><span class="dot dot-brak"></span>${counts.brak}</span>` : ''}
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    // Animate progress bars
    requestAnimationFrame(() => {
        document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    });

    // Update sidebar stats
    updateSidebarStats();
}

function updateSidebarStats() {
    // Overall progress
    let totalProgress = 0;
    MILESTONES.forEach(m => {
        totalProgress += calculateMilestoneProgress(m.id);
    });
    const overallPct = Math.round((totalProgress / MILESTONES.length) * 100);
    document.getElementById('overall-progress').textContent = overallPct + '%';
    document.getElementById('overall-progress-bar').style.width = overallPct + '%';

    // Completed tasks (all 3 roles done)
    const completedTasks = state.tasks.filter(t =>
        t.copywriter === 'Gotowe' && t.grafik === 'Gotowe' && t.architekt === 'Gotowe'
    ).length;
    document.getElementById('completed-tasks').textContent = `${completedTasks} / ${state.tasks.length}`;

    // Total hours
    const totalHours = state.worklog.reduce((sum, w) => sum + w.hours, 0);
    document.getElementById('total-hours').textContent = totalHours + 'h';
}

// ============================================
// RENDERING — Tasks Table
// ============================================

function renderTasks() {
    const tbody = document.getElementById('tasks-tbody');
    tbody.innerHTML = '';

    const filterMilestone = document.getElementById('filter-milestone').value;
    const filterPriority = document.getElementById('filter-priority').value;
    const filterStatus = document.getElementById('filter-status').value;

    let filteredTasks = state.tasks;

    if (filterMilestone !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.milestone === filterMilestone);
    }
    if (filterPriority !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
    }
    if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(t =>
            t.copywriter === filterStatus || t.grafik === filterStatus || t.architekt === filterStatus
        );
    }

    filteredTasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="milestone-badge">${task.milestone}</span></td>
            <td><span class="category-text">${task.category}</span></td>
            <td>${task.name}</td>
            <td>${createStatusSelect(task.id, 'copywriter', task.copywriter)}</td>
            <td>${createStatusSelect(task.id, 'grafik', task.grafik)}</td>
            <td>${createStatusSelect(task.id, 'architekt', task.architekt)}</td>
            <td><span class="priority-badge priority-${task.priority}">${task.priority}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function createStatusSelect(taskId, role, currentStatus) {
    const statusClass = getStatusClass(currentStatus);
    return `
        <select class="status-select ${statusClass}" data-task="${taskId}" data-role="${role}" onchange="handleStatusChange(this)">
            <option value="Brak" ${currentStatus === 'Brak' ? 'selected' : ''}>Brak</option>
            <option value="W trakcie" ${currentStatus === 'W trakcie' ? 'selected' : ''}>W trakcie</option>
            <option value="Do akceptacji" ${currentStatus === 'Do akceptacji' ? 'selected' : ''}>Do akceptacji</option>
            <option value="Gotowe" ${currentStatus === 'Gotowe' ? 'selected' : ''}>Gotowe</option>
        </select>
    `;
}

function getStatusClass(status) {
    switch (status) {
        case 'Brak': return 'status-brak';
        case 'W trakcie': return 'status-wtrakcie';
        case 'Do akceptacji': return 'status-akceptacja';
        case 'Gotowe': return 'status-gotowe';
        default: return '';
    }
}

function handleStatusChange(select) {
    const taskId = select.dataset.task;
    const role = select.dataset.role;
    const newStatus = select.value;

    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
        task[role] = newStatus;
        saveState();

        // Update select styling
        select.className = 'status-select ' + getStatusClass(newStatus);

        // Re-render dashboard to reflect changes
        renderDashboard();
    }
}

// Make it globally accessible
window.handleStatusChange = handleStatusChange;

// Populate milestone filter
function populateMilestoneFilter() {
    const select = document.getElementById('filter-milestone');
    MILESTONES.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.id} — ${m.name}`;
        select.appendChild(opt);
    });

    // Also add KONTAKT
    const kontaktOpt = document.createElement('option');
    kontaktOpt.value = 'KONTAKT';
    kontaktOpt.textContent = 'KONTAKT';
    select.appendChild(kontaktOpt);
}

// ============================================
// RENDERING — Work Log
// ============================================

function renderWorklog() {
    const tbody = document.getElementById('worklog-tbody');
    tbody.innerHTML = '';

    // Sort descending by date
    const sorted = [...state.worklog].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(entry.date)}</td>
            <td>${entry.person}</td>
            <td><span class="milestone-badge">${entry.milestone}</span></td>
            <td><strong>${entry.hours}h</strong></td>
            <td>${entry.comment}</td>
            <td><button class="btn-delete" onclick="deleteWorklogEntry('${entry.id}')">Usuń</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Summary cards
    renderWorklogSummary();
}

function renderWorklogSummary() {
    const summary = document.getElementById('worklog-summary');
    const totalHours = state.worklog.reduce((sum, w) => sum + w.hours, 0);

    // Hours by person
    const byPerson = {};
    state.worklog.forEach(w => {
        byPerson[w.person] = (byPerson[w.person] || 0) + w.hours;
    });

    // Hours by milestone
    const byMilestone = {};
    state.worklog.forEach(w => {
        byMilestone[w.milestone] = (byMilestone[w.milestone] || 0) + w.hours;
    });

    let html = `
        <div class="worklog-stat">
            <div class="worklog-stat-value">${totalHours}h</div>
            <div class="worklog-stat-label">Łączne godziny</div>
        </div>
        <div class="worklog-stat">
            <div class="worklog-stat-value">${state.worklog.length}</div>
            <div class="worklog-stat-label">Wpisy</div>
        </div>
    `;

    Object.entries(byPerson).forEach(([person, hours]) => {
        html += `
            <div class="worklog-stat">
                <div class="worklog-stat-value">${hours}h</div>
                <div class="worklog-stat-label">${person}</div>
            </div>
        `;
    });

    summary.innerHTML = html;
}

function deleteWorklogEntry(entryId) {
    state.worklog = state.worklog.filter(w => w.id !== entryId);
    saveState();
    renderWorklog();
    updateSidebarStats();
}

window.deleteWorklogEntry = deleteWorklogEntry;

// ============================================
// WORK LOG FORM
// ============================================

function setupWorklogForm() {
    const btnAdd = document.getElementById('btn-add-entry');
    const btnCancel = document.getElementById('btn-cancel-entry');
    const btnSave = document.getElementById('btn-save-entry');
    const form = document.getElementById('add-entry-form');

    // Populate milestone select
    const milestoneSelect = document.getElementById('entry-milestone');
    MILESTONES.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.id} — ${m.name}`;
        milestoneSelect.appendChild(opt);
    });

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entry-date').value = today;

    btnAdd.addEventListener('click', () => {
        form.classList.toggle('hidden');
    });

    btnCancel.addEventListener('click', () => {
        form.classList.add('hidden');
    });

    btnSave.addEventListener('click', () => {
        const date = document.getElementById('entry-date').value;
        const person = document.getElementById('entry-person').value;
        const milestone = document.getElementById('entry-milestone').value;
        const hours = parseFloat(document.getElementById('entry-hours').value);
        const comment = document.getElementById('entry-comment').value;

        if (!date || !person || !milestone || !hours || !comment) {
            alert('Uzupełnij wszystkie pola!');
            return;
        }

        const newEntry = {
            id: 'w' + Date.now(),
            date,
            person,
            milestone,
            hours,
            comment,
        };

        state.worklog.push(newEntry);
        saveState();
        renderWorklog();
        updateSidebarStats();

        // Reset form
        document.getElementById('entry-hours').value = '';
        document.getElementById('entry-comment').value = '';
        form.classList.add('hidden');
    });
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.view;

            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            document.getElementById('view-' + target).classList.add('active');

            // Re-render to reflect latest data
            if (target === 'dashboard') renderDashboard();
            if (target === 'tasks') renderTasks();
            if (target === 'worklog') renderWorklog();
        });
    });
}

// ============================================
// UTILITIES
// ============================================

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('pl-PL', options);
}

// ============================================
// FILTER EVENT LISTENERS
// ============================================

function setupFilters() {
    document.getElementById('filter-milestone').addEventListener('change', renderTasks);
    document.getElementById('filter-priority').addEventListener('change', renderTasks);
    document.getElementById('filter-status').addEventListener('change', renderTasks);
}

// ============================================
// RENDER ALL
// ============================================

function renderAll() {
    renderDashboard();
    renderTasks();
    renderWorklog();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    populateMilestoneFilter();
    setupNavigation();
    setupFilters();
    setupWorklogForm();

    // Initial render with localStorage data (fast)
    renderAll();

    // Then load fresh data from Google Sheets (async)
    loadFromSheets();
});
