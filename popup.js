document.addEventListener('DOMContentLoaded', function() {
    console.log("Pretty Frontend is working ...")
    let currentActiveTab = "";  // This will hold the currently active tab name


    const checkData = {
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
    const appNameStore = {
        "netflix": "Netflix",
        "youtube": "YouTube",
        "twitter": "Twitter",
        "facebook": "Facebook",
        "instagram": "Instagram",
        "pinterest": "Pinterest",
        "reddit": "Reddit",
        "quora": "Quora",
        "amazon": "Amazon",
        "spotify": "Spotify",
        "tumblr": "Tumblr",
        "linkedin": "LinkedIn",
        "slack": "Slack",
        "medium": "Medium",
        "twitch": "Twitch",
        "discord": "Discord",
        "stack": "Stack Overflow",
        "leetcode": "Leetcode",
    };
    const getRandomTimeAndPercentage = () => {
        // Generate random hour and minute
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
    
        // Format the hour and minute to ensure two digits
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
    
        // Calculate the percentage of the day that has passed
        const totalMinutes = hours * 60 + minutes;
        const percentageOfDay = Math.floor((totalMinutes / (24 * 60)) * 100);
    
        // Return formatted time and percentage
        return [`${formattedHours}h ${formattedMinutes}mn`, percentageOfDay];
    };

    const getWeeklyTimes = () => {

    }

    const getDailyTimes = () => {

    }
    
    // Example usage:
    
    console.log(checkData.netflix);


    // Event listeners for tab buttons
    document.querySelectorAll('.tablinks').forEach(tab => {
        tab.addEventListener('click', function(evt) {
            openTab(evt, this.getAttribute('data-tab'));
        });
    });

    // Define the openTab function
    function openTab(evt, tabName) {
        currentActiveTab = tabName;
        console.log("current Tab"+currentActiveTab);

        let tabcontent = document.getElementsByClassName("tabcontent");
        let tablinks = document.getElementsByClassName("tablinks");
        // console.log(tabcontent)
        console.log(tablinks)


        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }


        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";

    }

    document.querySelectorAll('.custom-control-input').forEach(item => {
        item.addEventListener('change', event => {
            const appId = event.target.id.replace('Check', '');
            const isChecked = event.target.checked;

            checkData[appId] = isChecked;
            console.log(appId,"isChecked",checkData[appId]);
            // chrome.storage.sync.set({ "checkPersist": checkData });

            if (isChecked) {
                console.log("true flag")
            createListItem(currentActiveTab, appId);
   
            } else {
                console.log("false flag")
                removeApp(appId);
            }
        });
    });

    // function renderApp(appId) {
    //     const dailyElement = document.createElement("li");
    //     dailyElement.id = `${appId}-daily`;
    //     dailyElement.textContent = `${appId} content for Daily`;
    //     document.getElementById("daily").appendChild(dailyElement);

    //     const weeklyElement = document.createElement("li");
    //     weeklyElement.id = `${appId}-weekly`;
    //     weeklyElement.textContent = `${appId} content for Weekly`;
    //     document.getElementById("weekly").appendChild(weeklyElement);
    // }

    function removeApp(appId) {
        const dailyElement = document.getElementById(`${appId}-daily`);
        if (dailyElement) dailyElement.remove();

        const weeklyElement = document.getElementById(`${appId}-weekly`);
        if (weeklyElement) weeklyElement.remove();
    }

    // chrome.storage.sync.get(["checkPersist"], function(data) {
    //     const storedCheckData = data.checkPersist || {};
    //     for (const appId in storedCheckData) {
    //         if (storedCheckData[appId]) {
    //             renderApp(appId);
    //         }
    //     }
    // });

function rendererApp(appId, range, timeSpent, percentage) {
    // console.log("beginning render")
    // Create the main list item container
    const listItem = document.createElement("li");
    listItem.className = 'main-list-group-item';
    listItem.id = `${appId}-${range}`;


    // Create the content div and append it to the list item
    const contentDiv = document.createElement("div");
    contentDiv.className = 'content';
    listItem.appendChild(contentDiv);

    // Create and append the image (app icon) to the content div
    const appIcon = document.createElement("img");
    appIcon.src = `assets/images/icons/${appId}.png`;
    appIcon.alt = `${appId}`;
    appIcon.className = 'main-app-icon';
    contentDiv.appendChild(appIcon);

    // Create and append the app name heading to the content div
    const appNameHeading = document.createElement("h6");
    appNameHeading.className = 'app-name';
    appNameHeading.textContent = appNameStore[appId];
    contentDiv.appendChild(appNameHeading);

    // Create and append the time spent div to the content div
    const timeDiv = document.createElement("div");
    timeDiv.className = 'time';
    timeDiv.textContent = timeSpent;
    contentDiv.appendChild(timeDiv);

    // Create the progress bar container and append it to the list item
    const progressDiv = document.createElement("div");
    progressDiv.className = 'progress';
    listItem.appendChild(progressDiv);

    // Create the progress bar and append it to the progress bar container
    const progressBar = document.createElement("div");
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('style', `width: ${percentage}%`);
    progressBar.setAttribute('aria-valuenow', percentage.toString());
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressDiv.appendChild(progressBar);

    // Append the list item to the appropriate container in the DOM
    // For example, appending to a 'ul' with id 'app-list'
    return listItem


    // }
    // if (tabName === "Week") {
    //     console.log(tabName)


    // }
}
function createListItem(tab, app) {
    const appId = app
    const timeandpercentD = getRandomTimeAndPercentage();
    const timeandpercentW = getRandomTimeAndPercentage();

    let weekItem =  rendererApp(appId,"weekly", timeandpercentW[0], timeandpercentW[1]);
    let dayItem =  rendererApp(appId,"daily", timeandpercentD[0], timeandpercentD[1]);
 console.log("current",tab)
 document.getElementById("day-list").appendChild(dayItem);
 document.getElementById('week-list').appendChild(weekItem);



 }

    
});








/*window.onload = function() {
    console.log("checked popup first")

    // Assuming checkData is predefined and stores the checkbox state
    const checkData = {
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
    };
    console.log(checkData.netflix);
    function openTab(evt, tabName) {
        console.log("open Tab")
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    document.getElementById("select-tab").onclick = function(event) {
        openTab(event, 'Select');
    };

    document.querySelectorAll('.custom-control-input').forEach(item => {
        item.addEventListener('change', (event) => {
            const appId = event.target.id.replace('Check', '');
            const isChecked = event.target.checked;

            checkData[appId] = isChecked;
            chrome.storage.sync.set({ "checkPersist": checkData });

            if (isChecked) {
                renderApp(appId);
            } else {
                removeApp(appId);
            }
        });
    });

    function renderApp(appId) {
        // Dynamically create the content for the app in both Daily and Weekly tabs
        const dailyElement = document.createElement("li");
        dailyElement.id = `${appId}-daily`;
        dailyElement.textContent = `${appId} content for Daily`; // Placeholder content
        document.getElementById("daily").appendChild(dailyElement);

        const weeklyElement = document.createElement("li");
        weeklyElement.id = `${appId}-weekly`;
        weeklyElement.textContent = `${appId} content for Weekly`; // Placeholder content
        document.getElementById("weekly").appendChild(weeklyElement);
    }

    function removeApp(appId) {
        // Remove the content for the app from both Daily and Weekly tabs
        const dailyElement = document.getElementById(`${appId}-daily`);
        if (dailyElement) {
            dailyElement.remove();
        }

        const weeklyElement = document.getElementById(`${appId}-weekly`);
        if (weeklyElement) {
            weeklyElement.remove();
        }
    }

    // Initial load: render apps based on stored data
    chrome.storage.sync.get(["checkPersist"], function(data) {
        const storedCheckData = data.checkPersist || {};
        for (const appId in storedCheckData) {
            if (storedCheckData[appId]) {
                renderApp(appId);
            }
        }
    });
};
 */