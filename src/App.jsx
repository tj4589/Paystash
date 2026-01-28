import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import ReceiveMoney from './pages/ReceiveMoney';
import ScanQR from './pages/ScanQR';
import TopUp from './pages/TopUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/receive" element={<ReceiveMoney />} />
        <Route path="/scan" element={<ScanQR />} />
        <Route path="/topup" element={<TopUp />} />
      </Routes>
    </Router>
  );
}

export default App;
