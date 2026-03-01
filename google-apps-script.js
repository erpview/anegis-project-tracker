/**
 * ============================================
 * ANEGIS WWW Project Tracker — Google Apps Script API
 * ============================================
 * 
 * INSTRUKCJA INSTALACJI:
 * 1. Otwórz arkusz Google → Rozszerzenia → Apps Script
 * 2. Usuń cały domyślny kod w edytorze
 * 3. Wklej CAŁY ten plik
 * 4. Kliknij "Wdróż" → "Nowe wdrożenie"
 * 5. Typ: "Aplikacja internetowa"
 * 6. Wykonaj jako: "Ja" (Twój email)
 * 7. Kto ma dostęp: "Każdy"
 * 8. Kliknij "Wdróż"
 * 9. Skopiuj URL wdrożenia i wklej go do pliku app.js (zmienna APPS_SCRIPT_URL)
 */

// ============================================
// CONFIGURATION
// ============================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// Sheet names — adjust if your sheets have different names
const SHEET_DASHBOARD = 'Dashboard z formułami'; // Sheet 1: Milestones
const SHEET_TASKS = 'Status zadań';               // Sheet 2: Task tracker
const SHEET_WORKLOG = 'Dziennik pracy';            // Sheet 3: Worklog

// ============================================
// GET HANDLER — Read data
// ============================================

function doGet(e) {
    try {
        const action = e.parameter.action || 'load';

        if (action === 'load') {
            const milestones = loadMilestones();
            const tasks = loadTasks();
            const worklog = loadWorklog();

            return jsonResponse({
                success: true,
                milestones: milestones,
                tasks: tasks,
                worklog: worklog
            });
        }

        return jsonResponse({ success: false, error: 'Unknown action' });

    } catch (error) {
        return jsonResponse({ success: false, error: error.toString() });
    }
}

// ============================================
// POST HANDLER — Write data
// ============================================

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;

        if (action === 'updateTask') {
            updateTask(data.taskId, data.role, data.status);
            return jsonResponse({ success: true });
        }

        if (action === 'addWorklog') {
            addWorklogEntry(data.entry);
            return jsonResponse({ success: true });
        }

        if (action === 'deleteWorklog') {
            deleteWorklogEntry(data.rowIndex);
            return jsonResponse({ success: true });
        }

        if (action === 'saveAll') {
            saveAllTasks(data.tasks);
            saveAllWorklog(data.worklog);
            return jsonResponse({ success: true });
        }

        return jsonResponse({ success: false, error: 'Unknown action: ' + action });

    } catch (error) {
        return jsonResponse({ success: false, error: error.toString() });
    }
}

// ============================================
// MILESTONES — Read from Dashboard sheet
// ============================================

function loadMilestones() {
    const sheet = getSheet(SHEET_DASHBOARD);
    const data = sheet.getDataRange().getValues();
    const milestones = [];

    // Skip header row (row 0)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Skip empty rows
        if (!row[0]) continue;

        // Parse dates (column 2 = Start, column 3 = Deadline)
        let startStr = '';
        let deadlineStr = '';

        if (row[2] instanceof Date) {
            startStr = Utilities.formatDate(row[2], Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } else {
            startStr = parseDateString(String(row[2] || ''));
        }

        if (row[3] instanceof Date) {
            deadlineStr = Utilities.formatDate(row[3], Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } else {
            deadlineStr = parseDateString(String(row[3] || ''));
        }

        milestones.push({
            id: String(row[0] || '').trim(),
            name: String(row[1] || '').trim(),
            start: startStr,
            deadline: deadlineStr,
        });
    }

    return milestones;
}

// Helper to parse date strings like "02.03.2026" to "2026-03-02"
function parseDateString(str) {
    if (!str) return '';
    // Try dd.mm.yyyy format
    const parts = str.split('.');
    if (parts.length === 3) {
        return parts[2] + '-' + parts[1] + '-' + parts[0];
    }
    return str; // Return as-is if not in expected format
}

// ============================================
// TASKS — Read / Write
// ============================================

function loadTasks() {
    const sheet = getSheet(SHEET_TASKS);
    const data = sheet.getDataRange().getValues();
    const tasks = [];

    // Skip header row (row 0)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Skip empty rows
        if (!row[0] && !row[2]) continue;

        tasks.push({
            id: 't' + i,
            rowIndex: i + 1,  // 1-based row in the sheet
            milestone: String(row[0] || '').trim(),
            category: String(row[1] || '').trim(),
            name: String(row[2] || '').trim(),
            copywriter: String(row[3] || 'Brak').trim(),
            grafik: String(row[4] || 'Brak').trim(),
            architekt: String(row[5] || 'Brak').trim(),
            priority: String(row[6] || '').trim(),
        });
    }

    return tasks;
}

function updateTask(taskId, role, status) {
    const sheet = getSheet(SHEET_TASKS);
    const tasks = loadTasks();

    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found: ' + taskId);

    // Column mapping: 0=Milestone, 1=Category, 2=Name, 3=Copywriter, 4=Grafik, 5=Architekt
    const colMap = { 'copywriter': 4, 'grafik': 5, 'architekt': 6 }; // 1-based
    const col = colMap[role];
    if (!col) throw new Error('Unknown role: ' + role);

    sheet.getRange(task.rowIndex, col).setValue(status);
}

function saveAllTasks(tasks) {
    const sheet = getSheet(SHEET_TASKS);

    tasks.forEach(function (task) {
        if (task.rowIndex) {
            sheet.getRange(task.rowIndex, 4).setValue(task.copywriter || 'Brak');
            sheet.getRange(task.rowIndex, 5).setValue(task.grafik || 'Brak');
            sheet.getRange(task.rowIndex, 6).setValue(task.architekt || 'Brak');
        }
    });
}

// ============================================
// WORKLOG — Read / Write
// ============================================

function loadWorklog() {
    const sheet = getSheet(SHEET_WORKLOG);
    const data = sheet.getDataRange().getValues();
    const worklog = [];

    // Skip header row (row 0)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Skip empty rows
        if (!row[0] && !row[3]) continue;

        // Format date
        let dateStr = '';
        if (row[0] instanceof Date) {
            dateStr = Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } else {
            dateStr = String(row[0] || '');
        }

        worklog.push({
            id: 'w' + i,
            rowIndex: i + 1,  // 1-based row in the sheet
            date: dateStr,
            person: String(row[1] || '').trim(),
            milestone: String(row[2] || '').trim(),
            hours: Number(row[3]) || 0,
            comment: String(row[4] || '').trim(),
        });
    }

    return worklog;
}

function addWorklogEntry(entry) {
    const sheet = getSheet(SHEET_WORKLOG);
    sheet.appendRow([
        entry.date,
        entry.person,
        entry.milestone,
        entry.hours,
        entry.comment
    ]);
}

function deleteWorklogEntry(rowIndex) {
    const sheet = getSheet(SHEET_WORKLOG);
    if (rowIndex > 1 && rowIndex <= sheet.getLastRow()) {
        sheet.deleteRow(rowIndex);
    }
}

function saveAllWorklog(worklog) {
    const sheet = getSheet(SHEET_WORKLOG);

    // Clear existing data (keep header)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }

    // Write all entries
    worklog.forEach(function (entry, index) {
        const row = index + 2; // 1-based, skip header
        sheet.getRange(row, 1).setValue(entry.date);
        sheet.getRange(row, 2).setValue(entry.person);
        sheet.getRange(row, 3).setValue(entry.milestone);
        sheet.getRange(row, 4).setValue(entry.hours);
        sheet.getRange(row, 5).setValue(entry.comment);
    });
}

// ============================================
// HELPERS
// ============================================

function getSheet(name) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Try to find sheet by name
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
        // Fallback: try by index
        const sheets = ss.getSheets();
        if (name === SHEET_DASHBOARD && sheets.length >= 1) {
            sheet = sheets[0]; // First sheet
        } else if (name === SHEET_TASKS && sheets.length >= 2) {
            sheet = sheets[1]; // Second sheet
        } else if (name === SHEET_WORKLOG && sheets.length >= 3) {
            sheet = sheets[2]; // Third sheet
        }
    }

    if (!sheet) {
        throw new Error('Sheet not found: ' + name + '. Please check sheet names.');
    }

    return sheet;
}

function jsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// TEST FUNCTION (run manually to verify)
// ============================================

function testLoad() {
    const tasks = loadTasks();
    const worklog = loadWorklog();
    Logger.log('Tasks: ' + tasks.length);
    Logger.log('Worklog: ' + worklog.length);
    Logger.log(JSON.stringify(tasks[0]));
    Logger.log(JSON.stringify(worklog[0]));
}
