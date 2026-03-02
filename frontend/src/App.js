import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import TransactionForm from './components/TransactionForm';
import AccountHistory from './components/AccountHistory';
import Login from './components/Login';
import SupportChat from './components/SupportChat';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (u) => setUser(u);
  const requireAuth = (elem) => (user ? elem : <Navigate to="/login" />);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Banking</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/customers">Customers</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/transactions">Transactions</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/history">History</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/support">Support</Link>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              {user ? (
                <li className="nav-item">
                  <span className="nav-link">Hi, {user.username}</span>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-3">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/customers" element={requireAuth(<CustomerList />)} />
          <Route path="/transactions" element={requireAuth(<TransactionForm />)} />
          <Route path="/history" element={requireAuth(<AccountHistory />)} />
          <Route path="/support" element={requireAuth(<SupportChat />)} />
          <Route path="/" element={<h2>Welcome to Automated Banking System</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;