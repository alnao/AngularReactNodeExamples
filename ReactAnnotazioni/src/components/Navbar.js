import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-journal-text me-2"></i>
          AlNaoTazioni
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/annotazioni">
                <i className="bi bi-list-ul me-1"></i>
                Elenco Annotazioni
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cambio-stato">
                <i className="bi bi-arrow-repeat me-1"></i>
                Cambio Stato
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user?.username || 'Utente'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">{user?.email}</small>
                  </span>
                </li>
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">Ruolo: {user?.role}</small>
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
