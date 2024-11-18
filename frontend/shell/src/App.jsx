import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

const AuthApp = React.lazy(() => import('auth_mfe/AuthApp'));
const VitalsApp = React.lazy(() => import('vitals_mfe/VitalsApp'));

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth.token ? children : <Navigate to="/auth" />;
};

const App = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/auth">Authentication</Link></li>
          {auth.token && <li><Link to="/vitals">Vital Signs</Link></li>}
          {auth.token && (
            <li>
              <button onClick={logout} style={{ cursor: 'pointer' }}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/auth" element={<AuthApp />} />
          <Route
            path="/vitals"
            element={
              <ProtectedRoute>
                <VitalsApp token={auth.token} userId={auth.userId} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
