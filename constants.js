
const getStoredData = (callback) => {
    chrome.storage.sync.get(["prettyScreenTime", "checkPersist"], function (result) {
        callback(result);
    });
};

const updateUI = (appName, dailyTime, weeklyTime) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <div style="display: flex;">
            <div class="chat-img ml-1 mb-1"><img src="assets/images/icons/${appName}.png" alt="${appName}" class="rounded-square" width="25"></div>
            <div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">${formatAppName(appName)}</h6></div>
            <div class="chat-time d-inline-block font-10 pt-2">${formatTime(dailyTime)}</div>
        </div>
        <div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ${calculatePercentage(dailyTime, 1440)}%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div>
    
        `;
    document.querySelector("#daily").appendChild(listItem.cloneNode(true));
    listItem.querySelector(".chat-time").textContent = formatTime(weeklyTime);
    listItem.querySelector(".progress-bar").style.width = `${calculatePercentage(weeklyTime, 10080)}%`;
    document.querySelector("#weekly").appendChild(listItem);
};

const calculatePercentage = (time, total) => {
    return (time / total) * 100;
};

const formatTime = (minutes) => {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return `${hours > 0 ? hours + "h " : ""}${mins}m`;
};

const formatAppName = (appName) => {
    return appName.charAt(0).toUpperCase() + appName.slice(1);
};

const renderApps = () => {
    getStoredData((data) => {
        const { prettyScreenTime, checkPersist } = data;
        for (const appName in checkPersist) {
            if (checkPersist[appName]) {
                const today = new Date().toDateString();
                const dailyTime = prettyScreenTime && prettyScreenTime[today] && prettyScreenTime[today][appName] ? prettyScreenTime[today][appName] : 0;
                let weeklyTime = 0;
                for (let i = 0; i < 7; i++) {
                    const day = new Date(new Date().setDate(new Date().getDate() - i)).toDateString();
                    weeklyTime += prettyScreenTime && prettyScreenTime[day] && prettyScreenTime[day][appName] ? prettyScreenTime[day][appName] : 0;
                }
                updateUI(appName, dailyTime, weeklyTime);
            }
        }
    });
};






// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.active) {
//         chrome.scripting.executeScript({
//             target: {tabId: tab.id},
//             files: ['server.js']
//         });
//     }
// });
