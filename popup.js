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
                <h2 style="font-size: 24px; margin-bottom: 15px;">Pretty Screentime</h2>
                <p style="font-size: 16px; margin-bottom: 35px;">Let's track your screen time beautifully</p>
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
    
    function updateAppList(period) {
        const appListContainer = document.getElementById('app-list-container');
        appListContainer.innerHTML = '';
        
        let totalTime = 0;
        const appItems = [];
        
        // Get app usage data for the selected period
        for (const appId in selectedApps) {
            if (selectedApps[appId]) {
                const timeData = getRandomTimeAndPercentage();
                const timeValue = timeData[0];
                const percentage = timeData[1];
                totalTime += parseInt(timeValue.split('h')[0]) * 60 + parseInt(timeValue.split('h')[1].replace('mn', ''));
                
                appItems.push({
                    appId: appId,
                    name: appData[appId].name,
                    icon: appData[appId].icon,
                    time: timeValue,
                    percentage: percentage
                });
            }
        }
        
        // Sort apps by usage time (descending)
        appItems.sort((a, b) => {
            const timeA = parseInt(a.time.split('h')[0]) * 60 + parseInt(a.time.split('h')[1].replace('mn', ''));
            const timeB = parseInt(b.time.split('h')[0]) * 60 + parseInt(b.time.split('h')[1].replace('mn', ''));
            return timeB - timeA;
        });
        
        // Update the total time display
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        document.getElementById('total-time').textContent = `${hours}h ${minutes}m`;
        
        // Update the circular progress
        const progressRing = document.querySelector('.progress-ring-circle');
        // Calculate percentage of day spent (assuming 16 waking hours)
        const maxMinutes = period === 'day' ? 16 * 60 : (period === 'week' ? 16 * 60 * 7 : 16 * 60 * 30);
        const percentage = Math.min(100, (totalTime / maxMinutes) * 100);
        const circumference = 2 * Math.PI * 45;
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
        
        // Create and append app items
        appItems.forEach(item => {
            const appElement = createAppElement(item.appId, item.name, item.icon, item.time, item.percentage);
            appListContainer.appendChild(appElement);
            
            // Add click event to show app details
            appElement.addEventListener('click', () => {
                showAppDetails(item.appId);
            });
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
    
    function showAppDetails(appId) {
        // Navigate to statistics page
        showPage('stats-page');
        
        // Clear any existing stats
        const appDetailsContainer = document.getElementById('app-details-container');
        appDetailsContainer.innerHTML = '';
        
        // Create and show app stats card
        const template = document.getElementById('app-stats-template');
        const statsElement = template.content.cloneNode(true);
        
        statsElement.querySelector('.app-icon').src = appData[appId].icon;
        statsElement.querySelector('.app-icon').alt = appId;
        statsElement.querySelector('.app-name').textContent = appData[appId].name;
        
        // Mock data - would be replaced with real data
        const timeData = getRandomTimeAndPercentage();
        statsElement.querySelector('.daily-avg').textContent = timeData[0].split('h')[0] + ' min';
        
        // Add chart (simplified placeholder)
        const chartContainer = statsElement.querySelector('.chart-container');
        chartContainer.innerHTML = createSimpleChart();
        
        // Add close button functionality
        statsElement.querySelector('.close-stats').addEventListener('click', function() {
            showPage('overview-page');
        });
        
        // Add edit limit button functionality
        statsElement.querySelector('.edit-limit-button').addEventListener('click', function() {
            alert(`You would set a limit for ${appData[appId].name} here`);
        });
        
        appDetailsContainer.appendChild(statsElement);
    }
    
    function createSimpleChart() {
        // Create a simple bar chart as a placeholder
        // In a real implementation, you would use a proper charting library
        const values = [20, 35, 25, 45, 30, 55, 40];
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        let chartHtml = '<div style="display: flex; justify-content: space-between; align-items: flex-end; height: 100%;">';
        
        values.forEach((value, index) => {
            const height = (value / 60) * 100; // Scale to percentage of chart height (max 1 hour)
            
            chartHtml += `
                <div style="display: flex; flex-direction: column; align-items: center; width: ${100 / values.length}%;">
                    <div style="background-color: var(--secondary-color); height: ${height}%; width: 80%; border-radius: 4px;"></div>
                    <div style="font-size: 10px; color: var(--dark-gray); margin-top: 4px;">${daysOfWeek[index]}</div>
                </div>
            `;
        });
        
        chartHtml += '</div>';
        return chartHtml;
    }
    
    // Utility function to generate random time data
    function getRandomTimeAndPercentage() {
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
    }
});