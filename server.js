/* 
store appdata as {"prettyscreen time": {dates}}
store dates as {"date": {apptime}}
store apptime as {"app": time}
*/

console.log("Pretty Screentime is working...")




function checkCurrentTabUrl() {

    const regNetflix = /netflix/ig
    const regYoutube = /youtube/ig
    const regQuora = /quora/ig
    const regPinterest = /pinterest/ig
    const regLeetcode = /leetcode/ig
    const regTwitter = /twitter/ig
    const regFacebook = /facebook/ig
    const regAmazon = /amazon/ig
    const regReddit = /reddit/ig
    const regSpotify = /spotify/ig
    const regInstagram = /instagram/ig
    const regMedium = /medium/ig
    const regSlack = /slack/ig
    const regTumblr = /tumblr/ig
    const regLinkedin = /linkedin/ig
    const regDiscord = /discord/ig
    const regStack = /stackoverflow/ig
    const regTwitch = /twitch/ig

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

    for (i = 0; i < regExStore.length; i++) {
        searchFlag = regExStore[i].test(window.location.href)
        if (searchFlag) {
            return regExUrlMatcher[i]
        }
    }
}



// if (regNetflix.test(window.location.href)) {
//     url = 'netflix'
// }

// if (regYoutube.test(window.location.href)) {
//     url = 'youtube'
// }

// if (regQuora.test(window.location.href)) {
//     url = 'quora'
// }

// if (regPinterest.test(window.location.href)) {
//     url = 'pinterest'
// }

// if (regLeetcode.test(window.location.href)) {
//     url = 'leetcode'
// }

// if (regTwitter.test(window.location.href)) {
//     url = 'twitter'
// }

// if (regFacebook.test(window.location.href)) {
//     url = 'facebook'
// }

// if (regAmazon.test(window.location.href)) {
//     url = 'amazon'
// }

// if (regReddit.test(window.location.href)) {
//     url = 'reddit'
// }

// if (regSpotify.test(window.location.href)) {
//     url = 'spotify'
// }

// if (regInstagram.test(window.location.href)) {
//     url = 'instagram'
// }

// if (regMedium.test(window.location.href)) {
//     url = 'medium'
// }

// if (regSlack.test(window.location.href)) {
//     url = 'slack'
// }

// if (regTumblr.test(window.location.href)) {
//     url = 'tumblr'

// }
// if (regLinkedin.test(window.location.href)) {
//     url = 'linkedin'
// }

// if (regDiscord.test(window.location.href)) {
//     url = 'discord'
// }

// if (regStack.test(window.location.href)) {
//     url = 'stackoverflow'
// }

// if (regTwitch.test(window.location.href)) {
//     url = 'twitch'
// }


let url = checkCurrentTabUrl()


// dater = new Date()


let dateData = {}
let date = new Date().toDateString()

dateData[date] = {}


function update() {
    dateData[date][url] += 1
    chrome.storage.sync.set({ "prettyScreenTime": dateData });
}



let toMonitor = {}

chrome.storage.sync.get(['checkPersist'], (result) => {
    check = result['checkPersist']
    if (result['checkPersist']) {
        toMonitor = result['checkPersist'];

    }

})

chrome.storage.sync.get(['prettyScreenTime'], function (result) {
    if (result["prettyScreenTime"]) {
        dateData = result["prettyScreenTime"];
        if (dateData == undefined) {
            dateData = {}
        }
        if (dateData[date] == undefined) {
            dateData[date] = {}
        }
        if (dateData[date][url] == undefined) {
            dateData[date][url] = 0
        }

    }
    if (toMonitor && toMonitor[url] == true) {
        let timing = setInterval(update, 60000)


        document.addEventListener('visibilitychange', function () {

            if (document.hidden) {
                clearInterval(timing)
            }

            else {
                timing = setInterval(update, 60000)
            }
        })

    }

})


