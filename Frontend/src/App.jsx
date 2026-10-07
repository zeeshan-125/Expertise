import React, { useState, useEffect } from 'react';
import HR from './HR';
import Login from './components/Login';
import SiteCoordinator from './components/SiteCoordinator';
import DepartmentManager from './components/DepartmentManager';
import Cashier from './components/Cashier';

function App() {
  const [userSession, setUserSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('expertise_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (sessionData) => {
    setUserSession(sessionData);
    try {
      sessionStorage.setItem('expertise_session', JSON.stringify(sessionData));
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      sessionStorage.removeItem('expertise_session');
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleSwitchRole = (newSession) => {
    setUserSession(newSession);
    try {
      sessionStorage.setItem('expertise_session', JSON.stringify(newSession));
    } catch (e) {
      console.warn('SessionStorage unavailable', e);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const isSiteCoordinator =
    userSession?.roleKey === 'site_coord' ||
    userSession?.profile?.id === 'site_coord' ||
    userSession?.profile?.label?.includes('Site Coordinator') ||
    userSession?.email?.includes('site.');

  const isDepartmentManager =
    userSession?.roleKey === 'dept_mgr' ||
    userSession?.profile?.id === 'dept_mgr' ||
    userSession?.profile?.label?.includes('Dept Manager') ||
    userSession?.email?.includes('manager.');

  const isCashier =
    userSession?.roleKey === 'cashier' ||
    userSession?.profile?.id === 'cashier' ||
    userSession?.profile?.label?.includes('Cashier') ||
    userSession?.profile?.label?.includes('Paymaster') ||
    userSession?.email?.includes('paymaster') ||
    userSession?.email?.includes('cashier');

  return (
    <>
      {!userSession ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : isSiteCoordinator ? (
        <SiteCoordinator
          userSession={userSession}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      ) : isDepartmentManager ? (
        <DepartmentManager
          userSession={userSession}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      ) : isCashier ? (
        <Cashier
          userSession={userSession}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      ) : (
        <HR
          userSession={userSession}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />
      )}
    </>
  );
}

export default App;
