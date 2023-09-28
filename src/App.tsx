import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './Home';
import { TermsOfService } from './TermsOfService';
import './styles/style.css';
import './styles/canvasStyle.css';
import './styles/modals.css';
import './styles/textSite.css';
import { PrivacyPolicy } from './PrivacyPolicy';
import { LoadCanvas } from './LoadCanvas';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/load" element={<LoadCanvas />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
