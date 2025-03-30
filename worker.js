// Global variables for active tracking
let currentActiveAppId = null;
let currentActiveStartTime = null;
let trackedApps = {}; // Stores the { appId: boolean } from storage

// Function to load tracked apps from storage
async function loadTrackedApps() {
    try {
        const data = await chrome.storage.local.get(['checkPersist']);
        // Use default if 'checkPersist' doesn't exist yet
        trackedApps = data.checkPersist || {
            "netflix": true,
            "youtube": true,
            "twitter": false,
            "facebook": false,
            "instagram": false,
            "pinterest": false,
            "reddit": false,
            "quora": false,
            "amazon": false,
            "spotify": false,
            "tumblr": false,
            "linkedin": false,
            "slack": false,
            "medium": false,
            "twitch": false,
            "discord": false,
            "stack": false,
            "leetcode": false,
        };
        console.log("Tracked apps loaded:", trackedApps);
    } catch (error) {
        console.error("Error loading tracked apps:", error);
        // Use default in case of error
        trackedApps = { "netflix": true, "youtube": true }; 
    }
}

// Utility functions

function getCurrentWeek() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    // Calculate ISO week number
    const dayNum = currentDate.getDay() || 7; // Make Sunday 7
    startDate.setDate(startDate.getDate() + 4 - (startDate.getDay() || 7));
    const yearStart = startDate.getTime();
    const weekNo = Math.ceil((((currentDate.getTime() - yearStart) / 86400000) + 1) / 7);
    return `${currentDate.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getCurrentDay() {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
}

// Function to check URL and return appId (keep existing)
function checkCurrentTabUrl(url) {
    const regNetflix = /netflix/i
    const regYoutube = /youtube/i
    const regQuora = /quora/i
    const regPinterest = /pinterest/i
    const regLeetcode = /leetcode/i
    const regTwitter = /twitter/i
    const regFacebook = /facebook/i
    const regAmazon = /amazon/i
    const regReddit = /reddit/i
    const regSpotify = /spotify/i
    const regInstagram = /instagram/i
    const regMedium = /medium/i
    const regSlack = /slack/i
    const regTumblr = /tumblr/i
    const regLinkedin = /linkedin/i
    const regDiscord = /discord/i
    const regStack = /stackoverflow/i
    const regTwitch = /twitch/i

    const regExStore = [
        regNetflix, regYoutube, regQuora,
        regPinterest, regLeetcode, regTwitter,
        regFacebook, regAmazon, regReddit,
        regSpotify, regInstagram, regMedium,
        regSlack, regTumblr, regLinkedin,
        regDiscord, regStack, regTwitch
    ]

    const regExUrlMatcher = [
        'netflix', 'youtube', "quora",
        "pinterest", "leetcode", "twitter",
        "facebook", "amazon", "reddit",
        "spotify", "instagram", "medium",
        "slack", "tumblr", "linkedin",
        "discord", "stackoverflow", "twitch"
    ]

    if (!url) return null; // Handle cases where URL might be undefined

    try {
        // Use URL constructor for more robust parsing if possible
        const hostname = new URL(url).hostname;
        for (let key = 0; key < regExStore.length; key++) {
            // Test against hostname for better accuracy
            if (regExStore[key].test(hostname)) {
                return regExUrlMatcher[key];
            } 
        }
    } catch (e) {
        // Fallback to simple regex test if URL parsing fails (e.g., for non-http URLs)
         for (let key = 0; key < regExStore.length; key++) {
            if (regExStore[key].test(url)) {
                return regExUrlMatcher[key];
            }
        }
    }

    return null;
}

// NEW: Centralized function to add time to storage
async function addTimeToStorage(appId, durationMinutes) {
    if (!appId || durationMinutes <= 0) {
        // console.log("Skipping storage update: No appId or duration <= 0");
        return; // Don't save if no app or no time passed
    }

    const currentWeek = getCurrentWeek(); // YYYY-Www
    const currentDay = getCurrentDay();   // YYYY-MM-DD
    const durationMs = durationMinutes * 60 * 1000; // Store duration in ms for potential future precision

    try {
        const result = await chrome.storage.local.get(['screenTimeData']);
        const data = result.screenTimeData || {}; // Initialize if not present

        // Ensure week object exists
        if (!data[currentWeek]) {
            data[currentWeek] = {};
        }
        // Ensure day object exists
        if (!data[currentWeek][currentDay]) {
            data[currentWeek][currentDay] = {};
        }
        // Ensure app object exists
        if (!data[currentWeek][currentDay][appId]) {
            // Get app name from popup data (assuming popup.js structure)
            // This part is slightly less ideal as worker shouldn't know popup specifics
            // Better: Pass appName along or have a shared app constant
            const appName = appId.charAt(0).toUpperCase() + appId.slice(1); // Simple capitalization
            data[currentWeek][currentDay][appId] = {
                name: appName, 
                timeSpentMs: 0 // Store time in Milliseconds
            };
        }

        // Increment time spent
        data[currentWeek][currentDay][appId].timeSpentMs += durationMs;

        // --- Debug Log ---
        console.log(`[addTimeToStorage] Saving data for ${appId}. New total Ms: ${data[currentWeek][currentDay][appId].timeSpentMs}. Data object:`, JSON.parse(JSON.stringify(data))); // Log before saving
        // --- End Debug Log ---

        // Save updated data
        await chrome.storage.local.set({ screenTimeData: data });
        // console.log(`Updated ${appId} on ${currentDay}: added ${durationMinutes.toFixed(2)}m. New total: ${(data[currentWeek][currentDay][appId].timeSpentMs / 60000).toFixed(2)}m`);

    } catch (error) {
        console.error("Error updating screen time data:", error);
    }
}

// NEW: Function to stop the current timer and save the time
async function stopCurrentTimer() {
    if (currentActiveAppId && currentActiveStartTime) {
        const endTime = Date.now();
        const durationMs = endTime - currentActiveStartTime;
        const durationMinutes = durationMs / 60000; // Convert ms to minutes

        // console.log(`Stopping timer for ${currentActiveAppId}. Duration: ${durationMinutes.toFixed(2)}m`);
        await addTimeToStorage(currentActiveAppId, durationMinutes); // Use await here

        // Reset active state ONLY AFTER saving
        currentActiveAppId = null;
        currentActiveStartTime = null;
    } else {
        // console.log("Stop timer called, but nothing active.");
    }
}

// NEW: Function to start timer for a specific app
async function startTimerForApp(appId) {
    // Stop any existing timer first
    await stopCurrentTimer();

    // --- Debug Log ---
    console.log(`[startTimerForApp] Received appId: ${appId}`);
    const isTracked = appId && trackedApps[appId];
    console.log(`[startTimerForApp] Is app tracked? ${isTracked}`);
    // --- End Debug Log ---

    // Check if the app ID is valid and if it's selected for tracking
    if (isTracked) { 
        console.log(`[startTimerForApp] Starting timer for tracked app: ${appId}`); // Log start
        currentActiveAppId = appId;
        currentActiveStartTime = Date.now();
    } else {
        console.log(`[startTimerForApp] App not tracked or invalid ID: ${appId}. No timer started.`); // Log no start
        // Ensure state is reset if app isn't tracked
        currentActiveAppId = null;
        currentActiveStartTime = null;
    }
}

// --- Worker Initialization ---
console.log("Service worker started/reloaded.");

// Load tracked apps on startup
loadTrackedApps();

// --- Setup Alarm for Periodic Saving ---
const ALARM_NAME = 'minuteSave';

chrome.alarms.get(ALARM_NAME, (alarm) => {
    if (!alarm) { // Create alarm if it doesn't exist
        chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 });
        console.log("Created periodic save alarm:", ALARM_NAME);
    }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
        // --- Debug Log ---
        console.log(`[Alarm triggered] Name: ${alarm.name}, Current App: ${currentActiveAppId}, StartTime: ${currentActiveStartTime}`);
        // --- End Debug Log ---

        if (currentActiveAppId && currentActiveStartTime) {
            // Timer is running, save the elapsed time chunk
            const now = Date.now();
            const durationMs = now - currentActiveStartTime;
            const durationMinutes = durationMs / 60000;

            // --- Debug Log ---
            console.log(`[Alarm] About to call addTimeToStorage for ${currentActiveAppId} with duration ${durationMinutes.toFixed(2)}m`);
            // --- End Debug Log ---

            await addTimeToStorage(currentActiveAppId, durationMinutes);
            
            // IMPORTANT: Reset start time to now to continue timing the current app
            currentActiveStartTime = now; 
        } else {
            console.log("[Alarm] No active app timer running."); // Log if no timer
        }
    }
});

// --- NEW Event Listeners ---

// Tab Activated: User switches to a different tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        // --- Debug Log ---
        console.log(`[onActivated] Tab ID: ${activeInfo.tabId}, URL: ${tab?.url}`);
        // --- End Debug Log ---
        if (tab && canAccessUrl(tab.url)) {
            const appId = checkCurrentTabUrl(tab.url);
            await startTimerForApp(appId);
        } else {
            await stopCurrentTimer();
        }
    } catch (error) {
        console.error("[onActivated] Error:", error);
        await stopCurrentTimer();
    }
});

// Tab Updated: URL changes in a tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // --- Debug Log ---
    if (changeInfo.url) { // Log only if URL actually changed
        console.log(`[onUpdated] Tab ID: ${tabId}, Active: ${tab.active}, New URL: ${changeInfo.url}`);
    }
    // --- End Debug Log ---
    if (changeInfo.url && tab.active && canAccessUrl(tab.url)) {
        const appId = checkCurrentTabUrl(tab.url); // Use tab.url here, not changeInfo.url directly
        await startTimerForApp(appId);
    } else if (changeInfo.url && tab.active && !canAccessUrl(tab.url)) {
        await stopCurrentTimer();
    }
});

// Window Focus Changed: User switches windows or minimizes/restores
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    // --- Debug Log ---
    console.log(`[onFocusChanged] Window ID: ${windowId}`);
    // --- End Debug Log ---
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        await stopCurrentTimer();
    } else {
        try {
            const [activeTab] = await chrome.tabs.query({ active: true, windowId: windowId });
             // --- Debug Log ---
            console.log(`[onFocusChanged] Focused window active tab URL: ${activeTab?.url}`);
             // --- End Debug Log ---
            if (activeTab && canAccessUrl(activeTab.url)) {
                const appId = checkCurrentTabUrl(activeTab.url);
                await startTimerForApp(appId);
            } else {
                await stopCurrentTimer(); 
            }
        } catch (error) {
            console.error("[onFocusChanged] Error:", error);
            await stopCurrentTimer();
        }
    }
});

// Tab Removed: User closes a tab
// We don't necessarily need to do anything special here, 
// as onActivated or onFocusChanged will handle stopping the timer 
// when the user switches to a different tab/window after closing.
// chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
//     console.log("Tab removed:", tabId);
//     // Optional: Could check if removeInfo.windowId still exists 
//     // and if the active tab is now different, but likely redundant.
// });

// --- Listener for Settings Changes from Popup ---
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'settingsUpdated') {
        console.log("Received settings update message from popup.");
        await loadTrackedApps(); // Reload the tracked apps list
        
        // Re-evaluate the current tab after settings change
        try {
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (activeTab && canAccessUrl(activeTab.url)) {
                const appId = checkCurrentTabUrl(activeTab.url);
                // console.log(`Re-evaluating current tab after settings update: ${activeTab.url}, AppId: ${appId}`);
                await startTimerForApp(appId); // Restart timer based on new settings
            } else {
                await stopCurrentTimer();
            }
        } catch (error) {
             console.error("Error re-evaluating tab after settings update:", error);
             await stopCurrentTimer();
        }
    }
});

// Keep helper function for URL accessibility check
function canAccessUrl(url) {
    // Add check for undefined/null URL
    if (!url) return false; 
    return !url.startsWith('chrome://') && !url.startsWith('chrome-extension://');
}


// --- REMOVE OLD/REDUNDANT CODE BELOW --- 
/* 
// Remove old global variables like tabTimes, timerId, lastUpdated
let tabTimes = {}; 
let timerId = null;
let lastUpdated = Date.now();

// Remove old initialization function
function ensureTabInitialization(url) { ... }

// Remove old time update function
function updateTimeSpent(URL, updateStorage = false) { ... }

// Remove old updateTabData function
function updateTabData(URL, tabName, duration) { ... }

// Remove old event listeners that use the old logic
chrome.tabs.onActivated.addListener(activeInfo => { ... OLD LOGIC ... });
chrome.windows.onFocusChanged.addListener((windowId) => { ... OLD LOGIC ... });
chrome.tabs.onRemoved.addListener(tabId => { ... OLD LOGIC ... });

// Remove old setInterval logic
timerId = setInterval(() => { ... }, 120000);

// Remove old handleDayChange logic if not needed (storage structure handles days)
function handleDayChange() { ... }
setInterval(handleDayChange, 60000); 
*/