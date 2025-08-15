import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeMonitoring } from './config/monitoring'

// Initialize monitoring and analytics
initializeMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
