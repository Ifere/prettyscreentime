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
                total  = 0
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


        $("#weekly").append('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id= ' + appName + 'wtime' + '> ' + '0mn' + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        $("#daily").append('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + times[1] + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
    }

    // alert("here")

    // netflix

    $('input[id=netflixCheck]').change(
        function () {

            if (this.checked) {
                // alert(times[0],times[1])

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.netflix = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'netflix'
                nameCapitalized = 'Netflix'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="netflixd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/netflix.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Netflix</h6></div><div class="chat-time d-inline-block font-10 pt-2">' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="netflixw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/netflix.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Netflix</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.netflix = false
                    chrome.storage.sync.set({ "checkPersist": check });
                })
                $("#netflixw").remove();
                $("#netflixd").remove();

            }
        });

    // youtube
    $('input[id=youtubeCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.youtube = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })
                appName = 'youtube'
                nameCapitalized = 'YouTube'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="youtubed"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/youtube.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">YouTube</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="youtubew"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/youtube.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">YouTube</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.youtube = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#youtubew").remove();
                $("#youtubed").remove();

            }
        });

    // quora

    $('input[id=quoraCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.quora = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })
                appName = 'quora'
                nameCapitalized = 'Quora'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="quorad"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/quora.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Quora</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="quoraw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/quora.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Quora</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.quora = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#quoraw").remove();
                $("#quorad").remove();

            }
        });


    // pinterest
    $('input[id=pinterestCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.pinterest = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'pinterest'
                nameCapitalized = 'Pinterest'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });


                $("#daily").append('<li style="list-style-type:none" id="pinterestd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/pinterest.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Pinterest</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="pinterestw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/pinterest.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Pinterest</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.pinterest = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#pinterestw").remove();
                $("#pinterestd").remove();

            }
        });


    // leetcode
    $('input[id=leetcodeCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.leetcode = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'leetcode'
                nameCapitalized = 'Leetcode'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="leetcoded"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/leetcode.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">LeetCode</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="leetcodew"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/leetcode.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">LeetCode</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.leetcode = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#leetcodew").remove();
                $("#leetcoded").remove();

            }
        });

    // twitter

    $('input[id=twitterCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.twitter = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'twitter'
                nameCapitalized = 'Twitter'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="twitterd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/twitter.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Twitter</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="twitterw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/twitter.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Twitter</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.twitter = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#twitterw").remove();
                $("#twitterd").remove();

            }
        });



    // facebook
    $('input[id=facebookCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.facebook = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'facebook'
                nameCapitalized = 'Facebook'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="facebookd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/facebook.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Facebook</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="facebookw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/facebook.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Facebook</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.facebook = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#facebookw").remove();
                $("#facebookd").remove();

            }
        });



    //  amazon

    $('input[id=amazonCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.amazon = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'amazon'
                nameCapitalized = 'Amazon'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="amazond"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/amazon.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Amazon</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="amazonw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/amazon.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Amazon</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.amazon = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#amazonw").remove();
                $("#amazond").remove();

            }
        });


    // reddit
    $('input[id=redditCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.reddit = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'reddit'
                nameCapitalized = 'Reddit'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="redditd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/reddit.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Reddit</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="redditw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/reddit.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Reddit</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.reddit = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#redditw").remove();
                $("#redditd").remove();

            }
        });

    $('input[id=spotifyCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.spotify = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'spotify'
                nameCapitalized = 'Spotify'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="spotifyd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/spotify.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Spotify</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="spotifyw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/spotify.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Spotify</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.spotify = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#spotifyw").remove();
                $("#spotifyd").remove();

            }
        });
    $('input[id=instagramCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.instagram = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'instagram'
                nameCapitalized = 'Instagram'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="instagramd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/instagram.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Instagram</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="instagramw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/instagram.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Instagram</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.instagram = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#instagramw").remove();
                $("#instagramd").remove();

            }
        });
    $('input[id=mediumCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.medium = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })


                appName = 'medium'
                nameCapitalized = 'Medium'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="mediumd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/medium.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Medium</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="mediumw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/medium.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Medium</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.medium = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#mediumw").remove();
                $("#mediumd").remove();

            }
        });
    $('input[id=slackCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.slack = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'slack'
                nameCapitalized = 'Slack'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="slackd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/slack.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Slack</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="slackw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/slack.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Slack</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.slack = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })
                $("#slackw").remove();
                $("#slackd").remove();

            }
        });
    $('input[id=tumblrCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.tumblr = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'tumblr'
                nameCapitalized = 'Tumblr'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="tumblrd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/tumblr.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Tumblr</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="tumblrw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/tumblr.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Tumblr</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.tumblr = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#tumblrw").remove();
                $("#tumblrd").remove();

            }
        });
    $('input[id=linkedinCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.linkedin = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'linkedin'
                nameCapitalized = 'LinkedIn'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });


                $("#daily").append('<li style="list-style-type:none" id="linkedind"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/linkedin.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">LinkedIn</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="linkedinw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/linkedin.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">LinkedIn</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.linkedin = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#linkedinw").remove();
                $("#linkedind").remove();

            }
        });
    $('input[id=discordCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.discord = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'discord'
                nameCapitalized = 'Discord'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="discordd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/discord.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Discord</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="discordw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/discord.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Discord</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.discord = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#discordw").remove();
                $("#discordd").remove();

            }
        });
    $('input[id=stackCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.stack = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'stack'
                nameCapitalized = 'Stack Overflow'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="stackd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/stack.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Stack Overflow</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="stackw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/stack.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Stack Overflow</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.stack = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                $("#stackw").remove();
                $("#stackd").remove();

            }
        });
    $('input[id=twitchCheck]').change(
        function () {

            if (this.checked) {

                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.twitch = true
                    chrome.storage.sync.set({ "checkPersist": check });

                })

                appName = 'twitch'
                nameCapitalized = 'Twitch'

                recentTimeDay(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 1440
                    $('#' + appName + 'd').html('<li style="list-style-type:none" id="' + appName + 'd"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                });

                recentTimeWeek(appName, (arr) => {
                    let hour = Math.floor(arr / 60);
                    let minutes = arr % 60;
                    let time = (hour > 0) ? `${hour}h ${minutes}mn` : `${minutes}mn`;
                    let percent = ((hour * 60) + minutes) * 100 / 10800;
                    $('#' + appName + 'w').html('<li style="list-style-type:none" id="' + appName + 'w"><div style="display: flex;"><div class="chat-img ml-1 mb-1" ><img src="assets/images/icons/' + appName + '.png" alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">' + nameCapitalized + '</h6></div><div class="chat-time d-inline-block font-10 pt-2 " id = ' + appName + 'dtime' + '> ' + time + '</div> </div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + percent + '%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div></div></li>');
        
                });

                $("#daily").append('<li style="list-style-type:none" id="twitchd"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/twitch.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Twitch</h6></div><div class="chat-time d-inline-block font-10 pt-2"> ' + times[1] + '</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: ' + times[0] + '%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');
                $("#weekly").append('<li style="list-style-type:none" id="twitchw"><div style="display: flex;"><div class="chat-img ml-1 mb-1"><img src="assets/images/icons/twitch.png"alt="user" class="rounded-square" width="25"></div><div class="chat-content d-inline-block pl-3 pt-2" style="flex-grow: 1;"><h6 class="font-weight-medium">Twitch</h6></div><div class="chat-time d-inline-block font-10 pt-2"> 1h 43mn</div></div><div class="progress mb-3"><div class="progress-bar" role="progressbar" style="width: 30%" aria-valuenow="100"aria-valuemin="0" aria-valuemax="100"></div></div></li>');

            }
            else {
                chrome.storage.sync.get(['checkPersist'], (result) => {
                    check = result['checkPersist']
                    check.twitch = false
                    chrome.storage.sync.set({ "checkPersist": check });

                })
                $("#twitchw").remove();
                $("#twitchd").remove();

            }
        });


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