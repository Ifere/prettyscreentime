
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

    for (let key = 0; key < regExStore.length; key++) {
        let searchFlag = regExStore[key].test(url);
        if (searchFlag) {
            return regExUrlMatcher[key];
        } 
    }

    return null;

}


function printing () {
    console.log("background workin printing");
    return
}

  
// worker.js

// Utility functions

function millisecondsToMinutesFormatted(milliseconds, decimalPlaces = 2) {
    return (milliseconds / 60000).toFixed(decimalPlaces);
}

function getCurrentWeek() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return `${currentDate.getFullYear()}-W${weekNumber}`;
}

function getCurrentDay() {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
}


// Global variables
let tabTimes = {};
let currentActiveUrl = null;
let timerId = null;
let lastUpdated = Date.now();

// Ensuring that tabTimes[url] is initialized
function ensureTabInitialization(url) {
    if (!tabTimes[url]) {
        tabTimes[url] = {
            startTime: Date.now(),
            totalTime: 0,
            name: checkCurrentTabUrl(url)
        };
    }
}

// Function to update time spent on a tab
function updateTimeSpent(URL, updateStorage = false) {
    let url = checkCurrentTabUrl(URL);
    if (tabTimes[url] && tabTimes[url].startTime) {
        const now = Date.now();
        const duration = now - tabTimes[url].startTime;
        tabTimes[url].totalTime += Math.round(duration / 60000); // Store total time in minutes
        tabTimes[url].startTime = now;
        let mins = millisecondsToMinutesFormatted(duration);
        tabTimes[url].minutes = mins;
        console.log(`URL ${url} was active for ${mins} minutes in ${getCurrentWeek()} - ${getCurrentDay()}.`);
        if (updateStorage) {
            let str = JSON.stringify({
                [getCurrentWeek()]: {
                    [getCurrentDay()]: {
                        [url]: tabTimes[url]
                    }
                }
            });
            console.log(`TabTimes => ${str}`);
            // Uncomment the line below to save to Chrome storage
            chrome.storage.local.set({tabTimes: tabTimes}, () => {
                console.log('Tab times updated in storage');
            });
        }
    }
}

function updateTabData(URL, tabName, duration) {
    let url = checkCurrentTabUrl(URL);

    const currentWeek = getCurrentWeek();
    const currentDay = getCurrentDay();

    chrome.storage.local.get(['screenTimeData'], (result) => {
        const data = result.screenTimeData || {};
        if (!data[currentWeek]) {
            data[currentWeek] = {};
        }
        if (!data[currentWeek][currentDay]) {
            data[currentWeek][currentDay] = {};
        }
        if (!data[currentWeek][currentDay][url]) {
            data[currentWeek][currentDay][url] = {
                name: tabName,
                timeSpent: 0
            };
        }
        data[currentWeek][currentDay][url].timeSpent += duration;

        // Uncomment the line below to save to Chrome storage
        chrome.storage.local.set({screenTimeData: data}, () => {
            console.log(`Updated screen time data for ${currentWeek}: ${JSON.stringify({
                [currentWeek]: {
                    [currentDay]: {
                        [url]: data[currentWeek][currentDay][url]
                    }
                }
            }, null, 2)}`);        });
    });
}

// Helper function to determine if the URL is accessible by the extension
function canAccessUrl(url) {
    return !url.startsWith('chrome://') && !url.startsWith('chrome-extension://');
}

console.log("Service worker loaded");

chrome.tabs.onActivated.addListener(activeInfo => {
    // activeInfo.tabId contains the ID of the tab that became active
    // activeInfo.windowId contains the ID of the window the active tab is in
    console.log(`Activated Tab ID: ${activeInfo.tabId}`);

    // Optionally, get more details about the tab
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        // Ensure the tab's URL is accessible (i.e., it's not a restricted URL)
        if (tab.url && canAccessUrl(tab.url)) {
            // const tabUrl = new URL(tab.url).hostname;
            const tabUrl = checkCurrentTabUrl(tab.url);
            const tabName = checkCurrentTabUrl(tab.url);
            console.log(`Tab activated: ${tabName}`);

            if (tabName) {
                if (currentActiveUrl !== null) {
                    updateTimeSpent(currentActiveUrl, true);
                }
                currentActiveUrl = tabUrl;
                ensureTabInitialization(currentActiveUrl);
                tabTimes[currentActiveUrl].url = tabName;
                if (timerId !== null) {
                    clearInterval(timerId);
                }
                timerId = setInterval(() => {
                    if (currentActiveUrl !== null) {
                        updateTimeSpent(currentActiveUrl, true);
                    }
                }, 120000); // Update every 2 minutes
            } else {
                if (currentActiveUrl !== null) {
                    clearInterval(timerId);
                }
            }
        }
    });
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // Browser window has lost focus
        if (currentActiveUrl !== null) {
            updateTimeSpent(currentActiveUrl, true);
            clearInterval(timerId);
        }
    } else {
        // Browser window has gained focus, update the start time for the current tab
        if (currentActiveUrl !== null) {
            tabTimes[currentActiveUrl].startTime = Date.now();
        }
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    if (tabTimes[tabId]) {
        updateTimeSpent(tabId, true);
        // delete tabTimes[tabId];
        console.log(`Tab times updated in storage after tab ${tabId} close for URL ${url} in ${getCurrentWeek()} - ${getCurrentDay()}.`);    }
});

timerId = setInterval(() => {
    if (currentActiveUrl !== null) {
        updateTimeSpent(currentActiveUrl, true);
    }
}, 120000); // Update every 2 minutes

// Function to handle day change
function handleDayChange() {
    const currentDay = getCurrentDay();
    const currentWeek = getCurrentWeek();

    chrome.storage.local.get(['screenTimeData'], (result) => {
        const data = result.screenTimeData || {};
        const lastUpdatedDay = new Date(lastUpdated).toISOString().split('T')[0];

        if (lastUpdatedDay !== currentDay) {
            // Calculate the difference in days
            const lastDate = new Date(lastUpdatedDay);
            const currentDate = new Date(currentDay);
            const dayDifference = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));

            // Handle the interval between the days
            for (let i = 1; i <= dayDifference; i++) {
                const missingDay = new Date(lastDate);
                missingDay.setDate(missingDay.getDate() + i);
                const missingDayString = missingDay.toISOString().split('T')[0];
                if (!data[currentWeek]) {
                    data[currentWeek] = {};
                }
                if (!data[currentWeek][missingDayString]) {
                    data[currentWeek][missingDayString] = {};
                }
                Object.keys(tabTimes).forEach(url => {
                    if (!data[currentWeek][missingDayString][url]) {
                        data[currentWeek][missingDayString][url] = {
                            name: tabTimes[url].name,
                            timeSpent: 0
                        };
                    }
                });
            }

            lastUpdated = Date.now();
            // Uncomment the line below to save to Chrome storage
            // chrome.storage.local.set({screenTimeData: data}, () => {
            //     console.log('Handled day change and updated data');
            // });
            console.log(`Handled day change and updated data for ${currentWeek}: ${JSON.stringify({
                [currentWeek]: data[currentWeek]
            }, null, 2)}`);        }
    });
}

// Call handleDayChange periodically
setInterval(handleDayChange, 60000); // Check for day