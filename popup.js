document.addEventListener('DOMContentLoaded', function() {
    console.log("Pretty Frontend is working ...");
    
    // App data store
    const appData = {
        "netflix": { name: "Netflix", icon: "assets/images/icons/netflix.png" },
        "youtube": { name: "YouTube", icon: "assets/images/icons/youtube.png" },
        "twitter": { name: "Twitter", icon: "assets/images/icons/twitter.png" },
        "facebook": { name: "Facebook", icon: "assets/images/icons/facebook.png" },
        "instagram": { name: "Instagram", icon: "assets/images/icons/instagram.png" },
        "pinterest": { name: "Pinterest", icon: "assets/images/icons/pinterest.png" },
        "reddit": { name: "Reddit", icon: "assets/images/icons/reddit.png" },
        "quora": { name: "Quora", icon: "assets/images/icons/quora.png" },
        "amazon": { name: "Amazon", icon: "assets/images/icons/amazon.png" },
        "spotify": { name: "Spotify", icon: "assets/images/icons/spotify.png" },
        "tumblr": { name: "Tumblr", icon: "assets/images/icons/tumblr.png" },
        "linkedin": { name: "LinkedIn", icon: "assets/images/icons/linkedin.png" },
        "slack": { name: "Slack", icon: "assets/images/icons/slack.png" },
        "medium": { name: "Medium", icon: "assets/images/icons/medium.png" },
        "twitch": { name: "Twitch", icon: "assets/images/icons/twitch.png" },
        "discord": { name: "Discord", icon: "assets/images/icons/discord.png" },
        "stack": { name: "Stack Overflow", icon: "assets/images/icons/stack.png" },
        "leetcode": { name: "Leetcode", icon: "assets/images/icons/leetcode.png" },
    };
    
    // State for app selection
    let selectedApps = {};
    
    // Current view state
    let currentPage = 'overview-page';
    let currentPeriod = 'day';
    
    let trackedAppIds = []; // Keep track of the order for navigation
    let currentStatIndex = 0; // Index of the currently displayed app
    
    // First-time user detection
    chrome.storage.local.get(["firstTimeUser", "checkPersist"], function(data) {
        const isFirstTimeUser = data.firstTimeUser === undefined ? true : data.firstTimeUser;
        selectedApps = data.checkPersist || {
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
        
        if (isFirstTimeUser) {
            showWelcomeScreen();
        } else {
            // Load app data and render UI
            renderUI();
        }
    });
    
    // Set up event listeners for menu and navigation
    initEventListeners();
    
    function showWelcomeScreen() {
        const cardElement = document.querySelector('.card');
        
        if (cardElement) {
            // Create welcome overlay
            const welcomeOverlay = document.createElement("div");
            welcomeOverlay.style.position = "absolute";
            welcomeOverlay.style.top = "0";
            welcomeOverlay.style.left = "0";
            welcomeOverlay.style.width = "100%";
            welcomeOverlay.style.height = "100%";
            welcomeOverlay.style.backgroundColor = "var(--quaternary-color)";
            welcomeOverlay.style.color = "white";
            welcomeOverlay.style.display = "flex";
            welcomeOverlay.style.flexDirection = "column";
            welcomeOverlay.style.justifyContent = "center";
            welcomeOverlay.style.alignItems = "center";
            welcomeOverlay.style.padding = "20px";
            welcomeOverlay.style.boxSizing = "border-box";
            welcomeOverlay.style.zIndex = "1000";
            welcomeOverlay.style.textAlign = "center";
            
            // Add welcome message content
            welcomeOverlay.innerHTML = `
                <img src="/plogo500.png" alt="logo" style="width: 80px; height: 80px; margin-bottom: 20px;">
                <h2 style="font-size: 24px; margin-bottom: 15px;">Pretty Screentime✨</h2>
                <p style="font-size: 16px; margin-bottom: 35px;">Hello👋🏼 and welcome! It's time to track your screen time beautifully😉</p>
                <button id="getStartedBtn" style="background-color: var(--white); color: var(--secondary-color); border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">Continue</button>
            `;
            
            // Add the overlay to the card
            cardElement.style.position = "relative";
            cardElement.appendChild(welcomeOverlay);
            
            // Add event listener to the Get Started button
            document.getElementById("getStartedBtn").addEventListener("click", function() {
                // Remove the overlay
                welcomeOverlay.remove();
                
                // Save that user has seen welcome
                chrome.storage.local.set({ "firstTimeUser": false });
                
                // Navigate to settings page to select apps
                showPage('settings-page');
                
                // Render the UI
                renderUI();
            });
        }
    }
    
    function initEventListeners() {
        // Hamburger menu toggle
        document.getElementById('menu-toggle').addEventListener('click', function() {
            document.getElementById('sidebar').classList.add('open');
        });
        
        // Close menu button
        document.getElementById('close-menu').addEventListener('click', function() {
            document.getElementById('sidebar').classList.remove('open');
        });
        
        // Sidebar menu navigation
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.addEventListener('click', function() {
                const pageName = this.getAttribute('data-page');
                showPage(pageName);
                document.getElementById('sidebar').classList.remove('open');
            });
        });
        
        // Time period selector
        document.querySelectorAll('.period-button').forEach(button => {
            button.addEventListener('click', function() {
                const period = this.getAttribute('data-period');
                setActivePeriod(period);
                updateAppList(period);
            });
        });
        
        // Focus mode button
        document.getElementById('start-focus').addEventListener('click', function() {
            alert('Focus mode would be activated here');
            // Implementation would go here
        });
    }
    
    function showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the selected page
        document.getElementById(pageName).classList.add('active');
        
        // Update sidebar highlight
        document.querySelectorAll('.sidebar-menu li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.sidebar-menu li[data-page="${pageName}"]`).classList.add('active');
        
        currentPage = pageName;
        
        // Special handling for different pages
        if (pageName === 'settings-page') {
            renderAppToggles();
        } else if (pageName === 'focus-page') {
            renderFocusAppList();
        } else if (pageName === 'stats-page') {
            renderStatisticsPage();
        } else if (pageName === 'overview-page') {
            updateAppList(currentPeriod);
        }
    }
    
    function setActivePeriod(period) {
        document.querySelectorAll('.period-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`.period-button[data-period="${period}"]`).classList.add('active');
        currentPeriod = period;
    }
    
    function renderUI() {
        // Populate the app list in the overview page
        updateAppList(currentPeriod);
        
        // Initialize the settings page toggles
        renderAppToggles();
        
        // Set up focus mode app list
        renderFocusAppList();
    }
    
    // Utility function to format minutes into H:MM string
    function formatMinutesToHoursMinutesString(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    // Utility function to format minutes into Xh Ymn string for app list
    function formatMinutesToAppListString(totalMinutes) {
        if (totalMinutes === 0) return '0h 00mn';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes.toString().padStart(2, '0')}mn`;
    }

    // Utility function to generate period-appropriate random time in minutes
    function getRandomTimeInMinutes(period) {
        let maxHours;
        if (period === 'day') {
            maxHours = 6; // e.g., max 6 hours random time per app for daily view
        } else if (period === 'week') {
            maxHours = 30; // e.g., max 30 hours random time per app for weekly view
        } else { // month
            maxHours = 100; // e.g., max 100 hours random time per app for monthly view
        }
        const hours = Math.random() * maxHours;
        const minutes = Math.random() * 60;
        return Math.round(hours * 60 + minutes);
    }

    function updateAppList(period) {
        const appListContainer = document.getElementById('app-list-container');
        appListContainer.innerHTML = '';
        
        let totalTimeInMinutes = 0; // Work with minutes internally
        const appItems = [];
        
        // 1. Generate more reasonable random times (in minutes) based on period
        for (const appId in selectedApps) {
            if (selectedApps[appId]) {
                const timeInMinutes = getRandomTimeInMinutes(period);
                totalTimeInMinutes += timeInMinutes;
                
                appItems.push({
                    appId: appId,
                    name: appData[appId].name,
                    icon: appData[appId].icon,
                    timeInMinutes: timeInMinutes, // Store raw minutes initially
                });
            }
        }
        
        // Sort apps by generated time initially (descending)
        appItems.sort((a, b) => b.timeInMinutes - a.timeInMinutes);
        
        // 2. Define period maximums in minutes
        const dayMaxMinutes = 24 * 60;
        const weekMaxMinutes = 24 * 7 * 60;
        const monthMaxMinutes = 24 * 30 * 60; // Use 30 days for month simplicity

        let periodMaximumMinutes;
        if (period === 'day') {
            periodMaximumMinutes = dayMaxMinutes;
        } else if (period === 'week') {
            periodMaximumMinutes = weekMaxMinutes;
        } else { // month
            periodMaximumMinutes = monthMaxMinutes;
        }

        // 3. Scaling Logic: Scale down individual times if total exceeds maximum
        let scalingFactor = 1;
        if (totalTimeInMinutes > periodMaximumMinutes) {
            scalingFactor = periodMaximumMinutes / totalTimeInMinutes;
            totalTimeInMinutes = periodMaximumMinutes; // Cap the total to the max
            console.log(`Scaling app times for ${period}. Factor: ${scalingFactor}`);
            
            // Apply scaling to each app item
            appItems.forEach(item => {
                item.timeInMinutes = Math.round(item.timeInMinutes * scalingFactor);
            });

            // Optional: Re-sort after scaling if precise order is critical
            // appItems.sort((a, b) => b.timeInMinutes - a.timeInMinutes);
        }
        // --- END Scaling logic ---

        // 4. Update the total time display using the final totalTimeInMinutes
        document.getElementById('total-time').textContent = formatMinutesToHoursMinutesString(totalTimeInMinutes);
        
        // ---> START: Update Time Period Label <---
        const timePeriodLabel = document.getElementById('time-period-label');
        const now = new Date();
        let labelText = '';

        if (period === 'day') {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            labelText = daysOfWeek[now.getDay()];
        } else if (period === 'week') {
            const dayOfMonth = now.getDate();
            const weekOfMonth = Math.ceil(dayOfMonth / 7);
            const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const currMonth = monthsOfYear[now.getMonth()]
            const monthsWithLessThan31Days = ["February", "April", "June", "September", "November"];
            let suffix = 'th';
            if (weekOfMonth === 1) suffix = 'st';
            else if (weekOfMonth === 2) suffix = 'nd';
            else if (weekOfMonth === 3) suffix = 'rd';
            labelText = (dayOfMonth > 21 && monthsWithLessThan31Days.includes(currMonth)) ? `${weekOfMonth}${suffix} Week` : 'Last Week';
        } else { // month
            const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            labelText = monthsOfYear[now.getMonth()];
        }
        timePeriodLabel.textContent = labelText;
        // ---> END: Update Time Period Label <---

        // 5. Update the circular progress (using periodMaximumMinutes as 100% mark)
        const progressRing = document.querySelector('.progress-ring-circle');
        const percentageOfPeriod = periodMaximumMinutes > 0 ? Math.min(100, (totalTimeInMinutes / periodMaximumMinutes) * 100) : 0;
        const circumference = 2 * Math.PI * 103.5; // Matches the current SVG radius
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference - (percentageOfPeriod / 100) * circumference;
        
        // 6. Create and append app items, formatting time and calculating percentage bar
        appItems.forEach(item => {
            // Calculate percentage for the app item's progress bar (relative to total time)
            const appPercentage = totalTimeInMinutes > 0 ? Math.min(100, (item.timeInMinutes / totalTimeInMinutes) * 100) : 0;
            // Format the final time for display in the list
            const timeFormatted = formatMinutesToAppListString(item.timeInMinutes);

            const appElement = createAppElement(item.appId, item.name, item.icon, timeFormatted, appPercentage);
            appListContainer.appendChild(appElement);
        });

        // Show a message if no apps are selected
        if (appItems.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = `
                <p>No apps selected for tracking.</p>
                <p>Go to Settings to select apps you want to monitor.</p>
            `;
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--dark-gray)';
            emptyMessage.style.padding = '40px 20px';
            appListContainer.appendChild(emptyMessage);
        }
    }
    
    function createAppElement(appId, name, icon, time, percentage) {
        const template = document.getElementById('app-item-template');
        const appElement = template.content.cloneNode(true);
        
        appElement.querySelector('.app-icon').src = icon;
        appElement.querySelector('.app-icon').alt = appId;
        appElement.querySelector('.app-name').textContent = name;
        appElement.querySelector('.progress-bar').style.width = `${percentage}%`;
        appElement.querySelector('.app-time').textContent = time;
        
        return appElement.querySelector('.app-item');
    }
    
    function renderAppToggles() {
        const togglesContainer = document.querySelector('.app-toggles');
        togglesContainer.innerHTML = '';
        
        // Create toggles for all available apps
        for (const appId in appData) {
            const template = document.getElementById('app-toggle-template');
            const toggleElement = template.content.cloneNode(true);
            
            toggleElement.querySelector('.app-icon').src = appData[appId].icon;
            toggleElement.querySelector('.app-icon').alt = appId;
            toggleElement.querySelector('.toggle-app-name').textContent = appData[appId].name;
            toggleElement.querySelector('.toggle-checkbox').checked = selectedApps[appId] || false;
            toggleElement.querySelector('.toggle-checkbox').id = `${appId}-toggle`;
            
            // Add event listener for toggle changes
            toggleElement.querySelector('.toggle-checkbox').addEventListener('change', function(event) {
                selectedApps[appId] = event.target.checked;
                
                // Save to storage
                chrome.storage.local.set({ "checkPersist": selectedApps }, function() {
                    console.log("App selection saved:", selectedApps);
                    
                    // Update app list if visible
                    if (currentPage === 'overview-page') {
                        updateAppList(currentPeriod);
                    }
                });
            });
            
            togglesContainer.appendChild(toggleElement);
        }
    }
    
    function renderFocusAppList() {
        const focusAppsList = document.getElementById('focus-apps-list');
        focusAppsList.innerHTML = '';
        
        // Only show app toggles for apps that are currently being tracked
        for (const appId in selectedApps) {
            if (selectedApps[appId]) {
                const template = document.getElementById('app-toggle-template');
                const toggleElement = template.content.cloneNode(true);
                
                toggleElement.querySelector('.app-icon').src = appData[appId].icon;
                toggleElement.querySelector('.app-icon').alt = appId;
                toggleElement.querySelector('.toggle-app-name').textContent = appData[appId].name;
                toggleElement.querySelector('.toggle-checkbox').checked = false; // Default to unchecked for focus mode
                toggleElement.querySelector('.toggle-checkbox').id = `${appId}-focus-toggle`;
                
                focusAppsList.appendChild(toggleElement);
            }
        }
    }
    
    function renderStatisticsPage() {
        const appDetailsContainer = document.getElementById('app-details-container');
        appDetailsContainer.innerHTML = ''; // Clear previous stats

        // Get the list of currently tracked app IDs
        trackedAppIds = Object.keys(selectedApps).filter(id => selectedApps[id]);

        if (trackedAppIds.length > 0) {
            currentStatIndex = 0; // Start with the first app
            displayAppStats(trackedAppIds[currentStatIndex]);
        } else {
            // Display a message if no apps are tracked
            appDetailsContainer.innerHTML = `
                <div style="text-align: center; color: var(--dark-gray); padding: 40px 20px;">
                    <p>No apps are currently being tracked.</p>
                    <p>Go to Settings to select apps you want to monitor.</p>
                </div>
            `;
        }
    }

    function displayAppStats(appId) {
        const appDetailsContainer = document.getElementById('app-details-container');
        appDetailsContainer.innerHTML = ''; // Clear previous stats

        if (!appId) return;

        const template = document.getElementById('app-stats-template');
        const statsElement = template.content.cloneNode(true);

        // Populate card with app info using new structure
        statsElement.querySelector('.app-stat-title').textContent = appData[appId].name;
        const iconContainer = statsElement.querySelector('.stat-icon');
        iconContainer.querySelector('.app-icon').src = appData[appId].icon;
        iconContainer.querySelector('.app-icon').alt = appId;

        // Mock data for Daily Average (using day-scoped random time)
        const randomMinutes = getRandomTimeInMinutes('day'); 
        statsElement.querySelector('.daily-avg').textContent = `${randomMinutes} min`;

        // Add chart (using updated simple chart)
        const chartContainer = statsElement.querySelector('.chart-container');
        chartContainer.innerHTML = createSimpleChart(); 

        // --- Navigation Logic (remains the same) ---
        const prevButton = statsElement.querySelector('.prev-stat-button');
        const nextButton = statsElement.querySelector('.next-stat-button');

        if (trackedAppIds.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }

        prevButton.addEventListener('click', () => {
            currentStatIndex = (currentStatIndex - 1 + trackedAppIds.length) % trackedAppIds.length;
            displayAppStats(trackedAppIds[currentStatIndex]);
        });

        nextButton.addEventListener('click', () => {
            currentStatIndex = (currentStatIndex + 1) % trackedAppIds.length;
            displayAppStats(trackedAppIds[currentStatIndex]);
        });
        // --- End Navigation Logic ---

        appDetailsContainer.appendChild(statsElement);
    }

    function createSimpleChart() {
        // Create a simple bar chart closer to the reference
        const values = [20, 35, 60, 45, 80, 55, 40]; // Example values (0-100 scale)
        // Match labels from reference, using empty strings for bars without labels
        const labels = ['4AM', '9AM', '12PM', '3PM', '7PM', '9PM', '11:30PM']; 
        
        // Use space-between for alignment and remove fixed flex-basis
        let chartHtml = '<div style="display: flex; justify-content: space-between; align-items: flex-end; height: 100%; padding: 10px 5px 0; box-sizing: border-box;">';
        
        values.forEach((value, index) => {
            const height = Math.max(5, value); // Ensure a minimum height for visibility
            const label = labels[index] || ''; // Get label or empty string
            
            // Removed fixed flex-basis from inner div
            chartHtml += `
                <div style="display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
                    <div style="background-color: ${value === 80 ? 'var(--secondary-color)' : '#C9D1F9'}; height: ${height}%; width: 12px; border-radius: 4px; margin-bottom: 4px;"></div>
                    <div style="font-size: 9px; color: var(--dark-gray); white-space: nowrap; height: 12px;">${label}</div>
                </div>
            `;
        });
        
        chartHtml += '</div>';
        return chartHtml;
    }
    
    // Utility function to generate random time data
    function getRandomTimeAndPercentage() {
        // Generate random hour and minute
        const hours = Math.floor(Math.random() * 100); // Allow larger hour values for testing
        const minutes = Math.floor(Math.random() * 60);
    
        // Format with consistent character width and balanced columns
        let hoursStr = hours.toString(); // No padding to save space
        let minutesStr = minutes.toString().padStart(2, '0');
    
        // Calculate the percentage of the day that has passed
        const totalMinutes = hours * 60 + minutes;
        const percentageOfDay = Math.floor((totalMinutes / (24 * 60)) * 100);
    
        // Return formatted time and percentage
        return [`${hoursStr}h ${minutesStr}mn`, percentageOfDay];
    }
});