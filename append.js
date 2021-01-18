window.onload = function () {

    let checkData = {
        "netflix": false,
        "youtube": false,
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

    }



    // default time
    const times = [0, '0mn']



    const recentTimeDay = function (appName, toExt) {
        let date = new Date().toDateString()
        if (appName == 'stack') {
            appName = 'stackoverflow'
        }

        chrome.storage.sync.get(["prettyScreenTime"], function (result) {
            if (result['prettyScreenTime']) {
                buffer = result['prettyScreenTime']
                if (buffer[date][appName]) {
                    toExt(buffer[date][appName])
                }

            }

        });
    }


    const getWeek = function (appName, days, callback) {
        if (appName == 'stack') {
            appName = 'stackoverflow'
        }

        chrome.storage.sync.get(["prettyScreenTime"], function (result) {
            if (result['prettyScreenTime']) {
                buffer = result['prettyScreenTime']
                total = 0
                for (i = 0; i < days + 1; i++) {
                    dt = new Date()
                    d = new Date()
                    dt.setDate(d.getDate() - i);
                    curr = dt.toDateString()
                    if (buffer[curr]) {
                        if (buffer[curr][appName]) {
                            total = total + buffer[curr][appName]
                        }
                    }

                }
                callback(total)


            }
        })
    }


    
    let recentTimeWeek = function (app, callback) {
        let d = new Date
        let dayDigit = d.getUTCDay()

        getWeek(app, dayDigit, function (num) {
            callback(num)
        })
    }


    const generateTitle = function (str) {
        s = str.charAt(0).toUpperCase() + str.slice(1)
        if (str == 'youtube') {
            s = 'YouTube'

        }
        if (str == 'stack') {
            s = 'Stack Overflow'

        }
        if (str == 'leetcode') {
            s = 'LeetCode'

        }
        if (str == 'linkedin') {
            s = 'LinkedIn'

        }
        return s

    }



    const renderApp = (appName) => {

        let nameCapitalized = appName.charAt(0).toUpperCase() + appName.slice(1)
        if (appName == "youtube") nameCapitalized = "YouTube"
        if (appName == "stack") nameCapitalized = "Stack Overflow"
        if (appName == "leetcode") nameCapitalized = "LeetCode"
        $('#' + appName + 'Check').prop('checked', true);

        recentTimeDay(appName, (arr) => {
            let hour = Math.floor(arr / 60);
            let minutes = arr % 60;
            let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
            let percent = ((hour * 60) + minutes) * 100 / 1440;
            $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        });

        recentTimeWeek(appName, (arr) => {
            let hour = Math.floor(arr / 60);
            let minutes = arr % 60;
            let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
            let percent = ((hour * 60) + minutes) * 100 / 10800;
            $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');

        });


        $("#weekly").append('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id= ' + appName + 'wtime' + '> ' + times[1] + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        $("#daily").append('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + times[1] + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
    }

    // alert("here")
    function buildAppPane(appName) {
        $(`input[id=${appName}Check]`).change(
            function () {

                if (this.checked) {
                    // alert(times[0],times[1])

                    chrome.storage.sync.get(['checkPersist'], (result) => {
                        check = result['checkPersist']
                        check[appName] = true
                        chrome.storage.sync.set({ "checkPersist": check });

                    })

                    nameCapitalized = generateTitle(appName)

                    recentTimeDay(appName, (arr) => {
                        let hour = Math.floor(arr / 60);
                        let minutes = arr % 60;
                        let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                        let percent = ((hour * 60) + minutes) * 100 / 1440
                        $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                    });

                    recentTimeWeek(appName, (n) => {
                        let hour = Math.floor(n / 60);
                        let minutes = n % 60;
                        let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                        let percent = ((hour * 60) + minutes) * 100 / 10800;
                        $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');

                    });

                    $("#daily").append('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/' + appName + '.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">'+nameCapitalized+'</h6></div><div class="chat-time d-inline-block font-10 pt-2">' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                    $("#weekly").append('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/' + appName + '.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">'+nameCapitalized+'</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

                }
                else {
                    chrome.storage.sync.get(['checkPersist'], (result) => {
                        check = result['checkPersist']
                        check[appName] = false
                        chrome.storage.sync.set({ "checkPersist": check });
                    })
                    $(`#${appName}w`).remove();
                    $(`#${appName}d`).remove();

                }
            });
    }

    // netflix
    buildAppPane('netflix')

    // youtube
    buildAppPane('youtube')

    // quora
    buildAppPane('quora')

    // pinterest
    buildAppPane('pinterest')

    // leetcode
    buildAppPane('leetcode')


    // twitter
    buildAppPane('twitter')

    // facebook
    buildAppPane('facebook')

    //  amazon
    buildAppPane('amazon')


    // reddit
    buildAppPane('reddit')


    buildAppPane('spotify')
    buildAppPane('instagram')

    buildAppPane('medium')
    buildAppPane('slack')

    buildAppPane('tumblr')

    buildAppPane('linkedin')

    buildAppPane('discord')

    buildAppPane('stack')

    buildAppPane('twitch')



    // store checked apps

    // if restarted

    // retreive stored apps

    // repopulate apps

    // update values


    // check apps
    // retrieve checked apps
    // update values



    // set interval if left open
    chrome.storage.sync.get(['checkPersist'], function (result) {
        if (result["checkPersist"]) {
            checkData = result["checkPersist"]
            for (const [key, value] of Object.entries(checkData)) {
                if (value == true) {
                    renderApp(key)

                }
            }
        } else {
            chrome.storage.sync.set({ 'checkPersist': checkData })

        }
    });


}