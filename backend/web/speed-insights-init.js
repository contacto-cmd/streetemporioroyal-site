// Vercel Speed Insights initialization
// This script loads and initializes Speed Insights for tracking web vitals
(function() {
  // Create script element
  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = `
    import { injectSpeedInsights } from '/node_modules/@vercel/speed-insights/dist/index.mjs';
    
    // Initialize Speed Insights
    injectSpeedInsights({
      debug: false
    });
  `;
  
  // Append to document
  if (document.body) {
    document.body.appendChild(script);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(script);
    });
  }
})();
