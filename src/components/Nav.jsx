import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './stylesheets/nav.css'
import { auth } from '../config/firebase-config'

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    auth.signOut().then(() => {
      console.log('user logged out')
    })
  }

  return (
    <>
      <nav className="navbar">
      <div className="navbar-wrapper">
        <a href="#" className="logo">
          <img src="/assets/Me Movies.svg" alt="logo" />
        </a>
        <div className={`hamburger-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        </div>
        <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <li className="navbar-item">
              <Link to="/search" className="navbar-link">
                Search
              </Link>
          </li>
          <li className="navbar-item">
              <Link to="/home" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
              <Link to="/collections" className="navbar-link">Your Catalogue</Link>
          </li>
          <li className="navbar-item">
            <Link to="/movies" className="navbar-link">
              Movies
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/tvshows" className="navbar-link">
              TV shows
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/login" className="navbar-link" onClick={logout}>
              Sign Out
            </Link>
          </li>
        </ul>
      </div>
    </nav>
    </>
      )
}
