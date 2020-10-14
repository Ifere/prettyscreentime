/* 
store appdata as {"prettyscreen time": {dates}}
store dates as {"date": {apptime}}
store apptime as {"app": time}
*/
console.log("pretty screentime is working...")

let url = ""
let regNetflix = /netflix/ig
let regYoutube = /youtube/ig
let regQuora = /quora/ig
let regPinterest = /pinterest/ig
let regLeetcode = /leetcode/ig
let regTwitter = /twitter/ig
let regFacebook = /facebook/ig
let regAmazon = /amazon/ig
let regReddit = /reddit/ig
let regSpotify = /spotify/ig
let regInstagram = /instagram/ig
let regMedium = /medium/ig
let regSlack = /slack/ig
let regTumblr = /tumblr/ig
let regLinkedin = /linkedin/ig
let regDiscord = /discord/ig
let regStack = /stackoverflow/ig
let regTwitch = /twitch/ig




if (regNetflix.test(window.location.href)) {
    url = 'netflix'
}

if (regYoutube.test(window.location.href)) {
    url = 'youtube'
}

if (regQuora.test(window.location.href)) {
    url = 'quora'
}

if (regPinterest.test(window.location.href)) {
    url = 'pinterest'
}

if (regLeetcode.test(window.location.href)) {
    url = 'leetcode'
}

if (regTwitter.test(window.location.href)) {
    url = 'twitter'
}

if (regFacebook.test(window.location.href)) {
    url = 'facebook'
}

if (regAmazon.test(window.location.href)) {
    url = 'amazon'
}

if (regReddit.test(window.location.href)) {
    url = 'reddit'
}

if (regSpotify.test(window.location.href)) {
    url = 'spotify'
}

if (regInstagram.test(window.location.href)) {
    url = 'instagram'
}

if (regMedium.test(window.location.href)) {
    url = 'medium'
}

if (regSlack.test(window.location.href)) {
    url = 'slack'
}

if (regTumblr.test(window.location.href)) {
    url = 'tumblr'

}
if (regLinkedin.test(window.location.href)) {
    url = 'linkedin'
}

if (regDiscord.test(window.location.href)) {
    url = 'discord'
}

if (regStack.test(window.location.href)) {
    url = 'stackoverflow'
}

if (regTwitch.test(window.location.href)) {
    url = 'twitch'
}


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
        console.log(dateData)
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


