document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loading-state');
  const siteContent = document.getElementById('site-content');
  const domainElement = document.getElementById('site-domain');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const recommendation = document.getElementById('recommendation');
  const reportBtn = document.getElementById('report-btn');

  // Show loading for a moment (better UX)
  setTimeout(async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url || !tab.url.startsWith('http')) {
        showResult("N/A", "unknown", "This is not a website.", "No website detected");
        return;
      }

      const currentDomain = new URL(tab.url).hostname.replace('www.', '');
      domainElement.textContent = currentDomain;

      // Ask the background script for the site info
      chrome.runtime.sendMessage({ action: "getSiteInfo", url: tab.url }, (siteInfo) => {
        if (siteInfo) {
          const statusMap = {
            'green': '✅ Trusted',
            'yellow': '⚠️ Caution',
            'red': '❌ Avoid'
          };
          showResult(
            currentDomain, 
            siteInfo.rating, 
            siteInfo.recommendation,
            statusMap[siteInfo.rating] || 'Unknown'
          );
        } else {
          showResult(
            currentDomain, 
            "unknown", 
            "This site hasn't been rated yet. Help us improve by reporting your experience!",
            "🤔 Unknown"
          );
        }
      });
    } catch (error) {
      showResult("Error", "unknown", "Unable to analyze this site.", "Error occurred");
    }
  }, 800); // Small delay for better UX

  function showResult(domain, rating, recommendationText, statusTextContent) {
    domainElement.textContent = domain;
    statusDot.className = `status-dot ${rating}`;
    statusText.textContent = statusTextContent;
    recommendation.textContent = recommendationText;
    recommendation.className = `recommendation ${rating}`;
    
    // Hide loading and show content with animation
    loadingState.style.display = 'none';
    siteContent.style.display = 'block';
  }

  // Report button functionality
  reportBtn.addEventListener('click', () => {
    // For now, just show an alert. You can later integrate with a reporting system
    alert('Thanks for helping! Report feature coming soon. 🚀');
  });
});