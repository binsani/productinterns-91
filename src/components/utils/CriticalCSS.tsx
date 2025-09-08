import { useEffect } from 'react';

// Critical CSS that should be inlined for above-the-fold content
const criticalCSS = `
  /* Critical path CSS for initial page load */
  .critical-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(to bottom right, #dbeafe, #ffffff, #dcfce7);
  }
  
  .critical-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e5e7eb;
  }
  
  .critical-hero {
    padding: 3rem 1rem;
    text-align: center;
    background: linear-gradient(to bottom right, #dbeafe, #ffffff, #dcfce7);
  }
  
  .critical-title {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: #111827;
  }
  
  .critical-button {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 2rem;
    background: linear-gradient(to right, #2563eb, #059669);
    color: white;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s ease;
  }
  
  .critical-button:hover {
    transform: translateY(-1px);
  }
  
  @media (min-width: 768px) {
    .critical-title {
      font-size: 3.75rem;
    }
    
    .critical-hero {
      padding: 6rem 1rem;
    }
  }
`;

export const CriticalCSS = () => {
  useEffect(() => {
    // Inject critical CSS if not already present
    if (!document.querySelector('#critical-css')) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }

    // Remove critical CSS after main CSS loads
    const removeCriticalCSS = () => {
      const criticalStyle = document.querySelector('#critical-css');
      if (criticalStyle) {
        setTimeout(() => {
          criticalStyle.remove();
        }, 1000); // Remove after 1 second to ensure smooth transition
      }
    };

    // Listen for load event
    if (document.readyState === 'complete') {
      removeCriticalCSS();
    } else {
      window.addEventListener('load', removeCriticalCSS);
      return () => window.removeEventListener('load', removeCriticalCSS);
    }
  }, []);

  return null;
};