document.addEventListener('DOMContentLoaded', function() {
    console.log("Pretty Frontend is working ...");
    
    // 1. First, log all tab elements to see what's available
    const tabElements = document.getElementsByClassName("tabcontent");
    console.log("Tab elements:", tabElements);
    
    // 2. Force the first tab to be visible, regardless of ID
    if (tabElements.length > 0) {
        tabElements[0].style.display = "block";
        console.log("Made first tab visible:", tabElements[0].id);
    }
    
    // 3. Add a welcome message for first-time users
    chrome.storage.local.get("firstTimeUser", function(data) {
        const isFirstTimeUser = data.firstTimeUser === undefined ? true : data.firstTimeUser;
        
        if (isFirstTimeUser) {
            // Wait a moment to ensure DOM is fully loaded
            setTimeout(() => {
                // Find the card element that contains the whole extension UI
                const cardElement = document.querySelector('.card');
                
                if (cardElement) {
                    // Create welcome overlay that covers the entire card
                    const welcomeOverlay = document.createElement("div");
                    welcomeOverlay.style.position = "absolute";
                    welcomeOverlay.style.top = "0";
                    welcomeOverlay.style.left = "0";
                    welcomeOverlay.style.width = "100%";
                    welcomeOverlay.style.height = "100%";
                    welcomeOverlay.style.backgroundColor = "#4169E1"; // Royal Blue
                    welcomeOverlay.style.color = "white";
                    welcomeOverlay.style.display = "flex";
                    welcomeOverlay.style.flexDirection = "column";
                    welcomeOverlay.style.justifyContent = "center";
                    welcomeOverlay.style.alignItems = "center";
                    welcomeOverlay.style.padding = "20px";
                    welcomeOverlay.style.boxSizing = "border-box";
                    welcomeOverlay.style.zIndex = "1000";
                    
                    // Add welcome message content
                    welcomeOverlay.innerHTML = `
                        <h2 style="font-size: 18px; margin-bottom: 15px; text-align: center;">👋 Welcome to Pretty Screentime!</h2>
                        <p style="font-size: 14px; margin-bottom: 20px; text-align: center;">Go to the <strong>Select</strong> tab to choose which apps you want to monitor.</p>
                        <button id="getStartedBtn" style="background-color: #FF5733; color: white; border: none; padding: 12px 24px; border-radius: 5px; font-size: 14px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">Get Started</button>
                    `;
                    
                    // Add the overlay to the card
                    cardElement.style.position = "relative"; // Ensure positioning context
                    cardElement.appendChild(welcomeOverlay);
                    
                    // Add event listener to the Get Started button
                    document.getElementById("getStartedBtn").addEventListener("click", function() {
                        // Remove the overlay
                        welcomeOverlay.remove();
                        
                        // Save that user has seen welcome
                        // chrome.storage.local.set({ "firstTimeUser": false });
                        
                        // Switch to the Select tab
                        const selectTabButton = document.querySelector('.tablinks[data-tab="select-tab"]');
                        if (selectTabButton) {
                            selectTabButton.click();
                        }
                    });
                    
                    console.log("Added welcome overlay to card element");
                } else {
                    console.error("Could not find card element to attach welcome message");
                }
            }, 100); // Short delay to ensure DOM is ready
        }
    });
    
    let currentActiveTab = "Today";  // Change from "Day" to "Today"

    // Add this code to initialize the Day tab on startup
    // ------------------
    // Make sure Day tab is visible by default
    const dayTabContent = document.getElementById("Today");
    if (dayTabContent) {
        dayTabContent.style.display = "block";
        
        // Highlight the Day tab button
        const dayTabButton = document.querySelector('.tablinks[data-tab="Today"]');
        if (dayTabButton) {
            dayTabButton.classList.add("active");
        }
    }
    // ------------------

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
    
    // First, load saved state
    chrome.storage.local.get(["checkPersist", "firstTimeUser"], function(data) {
        console.log("Loading saved state:", data.checkPersist);
        const storedCheckData = data.checkPersist || {};
        const isFirstTimeUser = data.firstTimeUser === undefined ? true : data.firstTimeUser;
        
        // Add this code to show welcome message for first-time users
        // ------------------
        if (isFirstTimeUser) {
            showWelcomeMessage();
            // chrome.storage.local.set({ "firstTimeUser": false });
        }
        
        // Check if there are any selected apps
        const hasSelectedApps = Object.values(storedCheckData).some(value => value === true);
        
        // Show a message if user is returning but has no apps selected
        if (!isFirstTimeUser && !hasSelectedApps) {
            showNoAppsSelectedMessage();
        }
        // ------------------
        
        // Update checkData with saved values
        for (const appId in storedCheckData) {
            if (checkData.hasOwnProperty(appId)) {
                // Update the internal state
                checkData[appId] = storedCheckData[appId];
                
                // Update checkbox UI
                const checkbox = document.getElementById(`${appId}Check`);
                if (checkbox) {
                    checkbox.checked = storedCheckData[appId];
                    console.log(`Set ${appId} checkbox to ${checkbox.checked}`);
                }
                
                // Create list items for checked apps
                if (storedCheckData[appId]) {
                    createListItem(currentActiveTab, appId);
                    console.log(`Created list item for ${appId}`);
                }
            }
        }

        console.log("Tab content elements:", document.getElementsByClassName("tabcontent"));
        console.log("Tab IDs:", Array.from(document.getElementsByClassName("tabcontent")).map(el => el.id));
    });
    
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
            console.log(appId, "isChecked", checkData[appId]);
            
            // Save to storage - using storage.local instead of storage.sync
            chrome.storage.local.set({ "checkPersist": checkData }, function() {
                console.log("State saved:", checkData);
                // Only proceed after save is confirmed
                if (isChecked) {
                    console.log("true flag")
                    createListItem(currentActiveTab, appId);
                } else {
                    console.log("false flag")
                    removeApp(appId);
                }
            });
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
    // Create the main list item container
    const listItem = document.createElement("li");
    listItem.className = 'main-list-group-item';
    listItem.id = `${appId}-${range}`;
    
    // Add some consistent spacing/margin
    listItem.style.marginBottom = "15px";
    
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

    return listItem;
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

    
    // Add these new functions inside your DOMContentLoaded event handler
    function showWelcomeMessage() {
        const welcomeDiv = document.createElement("div");
        welcomeDiv.style.textAlign = "center";
        welcomeDiv.style.padding = "20px";
        welcomeDiv.style.margin = "15px";
        welcomeDiv.style.backgroundColor = "#f8f9fa";
        welcomeDiv.style.borderRadius = "8px";
        welcomeDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        
        welcomeDiv.innerHTML = `
            <h3 style="margin-bottom: 10px; color: #495057;">Welcome to Pretty Screentime!</h3>
            <p style="color: #6c757d; margin-bottom: 8px;">Select the apps you want to monitor from the "Select" tab.</p>
            <p style="color: #6c757d; margin-bottom: 8px;">Your screentime data will be displayed here once you start using those apps.</p>
        `;
        
        // Insert at the top of the Day tab content
        const dayTab = document.getElementById("Today");
        if (dayTab) {
            dayTab.insertBefore(welcomeDiv, dayTab.firstChild);
        }

        console.log("Attempting to show welcome message, Day tab element:", document.getElementById("Today"));
    }
    
    function showNoAppsSelectedMessage() {
        const messageDiv = document.createElement("div");
        messageDiv.style.textAlign = "center";
        messageDiv.style.padding = "20px";
        messageDiv.style.margin = "15px 0";
        messageDiv.style.backgroundColor = "#f8f9fa";
        messageDiv.style.borderRadius = "8px";
        messageDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        
        messageDiv.innerHTML = `
            <h3 style="margin-bottom: 15px; color: #495057;">No apps selected</h3>
            <p style="color: #6c757d; margin-bottom: 15px;">Go to the "Select" tab to choose which apps you want to monitor.</p>
        `;
        
        // Create sample UI item to show how it would look
        const sampleItem = document.createElement("div");
        sampleItem.className = "sample-item";
        sampleItem.style.marginTop = "20px";
        sampleItem.style.opacity = "0.5";
        sampleItem.style.pointerEvents = "none";
        
        // Example of how data will be displayed
        const demoApps = ["netflix", "youtube"];
        demoApps.forEach(app => {
            const item = rendererApp(app, "demo", "00h 00mn", 0);
            item.style.opacity = "0.5";
            item.style.backgroundColor = "#f8f9fa";
            sampleItem.appendChild(item);
        });
        
        messageDiv.appendChild(sampleItem);
        
        // Insert at the top of the Day tab content
        const dayTab = document.getElementById("Today");
        if (dayTab) {
            dayTab.insertBefore(messageDiv, dayTab.firstChild);
        }
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