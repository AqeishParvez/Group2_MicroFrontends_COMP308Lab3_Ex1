import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const AuthApp = React.lazy(() => import('auth_mfe/AuthApp'));
const VitalsApp = React.lazy(() => import('vitals_mfe/VitalsApp'));

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/auth">Authentication</Link></li>
          <li><Link to="/vitals">Vital Signs</Link></li>
        </ul>
      </nav>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/auth" element={<AuthApp />} />
          <Route path="/vitals" element={<VitalsApp />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
