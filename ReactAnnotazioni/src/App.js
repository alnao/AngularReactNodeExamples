import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import ElencoAnnotazioni from './pages/ElencoAnnotazioni';
import CambioStato from './pages/CambioStato';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/annotazioni" /> : <Login />} />
          <Route path="/annotazioni" element={ <PrivateRoute><ElencoAnnotazioni /></PrivateRoute> } />
          <Route path="/cambio-stato" element={ <PrivateRoute><CambioStato /></PrivateRoute> } />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/annotazioni" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
