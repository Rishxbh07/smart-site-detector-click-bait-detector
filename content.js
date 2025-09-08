// Ask background.js to check this site
chrome.runtime.sendMessage({ action: "checkSite", url: window.location.href });

// Listen for banner message
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showBanner") {
    const banner = document.createElement("div");

// Modern glassmorphism banner styling with rounded corners and hover effects
    banner.style.position = "fixed";
    banner.style.top = "20px";
    banner.style.right = "20px";
    banner.style.width = "320px";
    banner.style.padding = "15px 20px";
    banner.style.zIndex = "999999";
    banner.style.textAlign = "left";
    banner.style.fontWeight = "500";
    banner.style.color = "white";
    banner.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    banner.style.fontSize = "14px";
    banner.style.borderRadius = "20px"; // More rounded corners
    banner.style.backdropFilter = "blur(15px)";
    banner.style.border = "1px solid rgba(255, 255, 255, 0.25)";
    banner.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)";
    banner.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    banner.style.opacity = "0";
    banner.style.transform = "translateY(-20px) scale(0.95)";
    banner.style.cursor = "pointer";
    
    // Hover effects
    banner.addEventListener('mouseenter', () => {
      banner.style.transform = "translateY(-5px) scale(1.02)";
      banner.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)";
    });
    
    banner.addEventListener('mouseleave', () => {
      banner.style.transform = "translateY(0) scale(1)";
      banner.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)";
    });
    
    // Animate in
    setTimeout(() => {
      banner.style.opacity = "1";
      banner.style.transform = "translateY(0) scale(1)";
    }, 100);

    if (msg.rating === "red") {
      banner.style.background = "linear-gradient(135deg, rgba(244, 67, 54, 0.9), rgba(198, 40, 40, 0.9))";
      banner.innerHTML = `<strong>🚨 WARNING</strong><br>${msg.recommendation}`;
    } else if (msg.rating === "yellow") {
      banner.style.background = "linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(245, 124, 0, 0.9))";
      banner.innerHTML = `<strong>⚠️ CAUTION</strong><br>${msg.recommendation}`;
    } else {
      banner.style.background = "linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.9))";
      banner.innerHTML = `<strong>✅ TRUSTED</strong><br>${msg.recommendation}`;
    }
    document.body.prepend(banner);

    // Auto-hide after 5 seconds
    // Click to dismiss functionality
    banner.addEventListener('click', () => {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(-20px) scale(0.9)";
      setTimeout(() => banner.remove(), 400);
    });

    // Auto-hide with improved animation
    setTimeout(() => {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(-20px) scale(0.9)";
      setTimeout(() => banner.remove(), 400);
    }, 7000);
  }
});
