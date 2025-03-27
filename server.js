/* 
store appdata as {"prettyscreen time": {dates}}
store dates as {"date": {apptime}}
store apptime as {"app": time}
*/

console.log("Pretty Server is working...");


function checkCurrentTabUrl() {

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
       let searchFlag = regExStore[key].test(window.location.href);
        if (searchFlag) {
            return regExUrlMatcher[key];
        } 
    }

    return null;


}

// let getCurrentUrl = () => {
//     let currUrl = checkCurrentTabUrl();
// currUrl ? console.log("Current URL => ", currUrl) : console.log("Current URL => nUlL!");

// }




// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.active) {
//         chrome.scripting.executeScript({
//             target: {tabId: tab.id},
//             files: ['server.js']
//         });
//     }
// });



// window.addEventListener('hashchange', function() {
//     console.log('URL hash has changed!');
//     let currentUrl = checkCurrentTabUrl();
//     console.log("Current UrL => ", currentUrl);
// }, false);



// if (regNetflix.test(window.location.href)) {
//     url = 'netflix'
// }



// dater = new Date();


// let dateData = {};
// let date = new Date().toDateString();

// dateData[date] = {}


// function update() {
//     dateData[date][url] += 1
//     chrome.storage.sync.set({ "prettyScreenTime": dateData });
// }



// let toMonitor = {}

// chrome.storage.sync.get(['checkPersist'], (result) => {
//     check = result['checkPersist']
//     if (result['checkPersist']) {
//         toMonitor = result['checkPersist'];

//     }

// })


//  function to update time to chrome storage

// chrome.storage.sync.get(['prettyScreenTime'], function (result) {
//     if (result["prettyScreenTime"]) {
//         dateData = result["prettyScreenTime"];
//         if (dateData == undefined) {
//             dateData = {}
//         }
//         if (dateData[date] == undefined) {
//             dateData[date] = {}
//         }
//         if (dateData[date][url] == undefined) {
//             dateData[date][url] = 0
//         }

//     }
//     if (toMonitor && toMonitor[url] == true) {
//         let timing = setInterval(update, 60000)


//         document.addEventListener('visibilitychange', function () {

//             if (document.hidden) {
//                 clearInterval(timing)
//             }

//             else {
//                 timing = setInterval(update, 60000)
//             }
//         })

//     }

// })



// change boundary



// // Setup the structure to store the time data
// let date = new Date().toDateString();
// let dateData = { [date]: {} };

// // Initialize or update the timer count
// function updateTimer() {
//     if (currentApp) {
//         dateData[date][currentApp] = (dateData[date][currentApp] || 0) + 1; // Increment the minute count
//         chrome.storage.sync.set({ "prettyScreenTime": dateData });
//     }
// }

// // Function to handle visibility changes
// function handleVisibilityChange() {
//     if (document.hidden) {
//         clearInterval(timer);
//     } else {
//         timer = setInterval(updateTimer, 60000); // Restart timer when tab is visible
//     }
// }

// // Check which apps are monitored
// chrome.storage.sync.get(['checkPersist', 'prettyScreenTime'], function (result) {
//     const checkPersist = result.checkPersist || {};
//     dateData = result.prettyScreenTime || { [date]: {} };

//     if (checkPersist[currentApp]) {
//         dateData[date][currentApp] = dateData[date][currentApp] || 0;
//         var timer = setInterval(updateTimer, 60000); // Set the timer to update every minute

//         document.addEventListener('visibilitychange', handleVisibilityChange);
//     }
// });
