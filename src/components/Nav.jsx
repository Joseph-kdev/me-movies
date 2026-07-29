import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./stylesheets/nav.css";
import { auth } from "../config/firebase-config";
import { Bounce, toast } from "react-toastify";
import { useUserAuth } from "../UserAuthContext";

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    if (user) {
      auth.signOut().then(() => {
        toast.error("Logged out", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <a href="/home" className="logo">
          <img src="/images/Me Movies.svg" alt="logo" className="rounded-lg" />
        </a>
        <div
          className={`hamburger-icon ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        </div>
        <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
          <li className="navbar-item">
            <NavLink to="/home" className="navbar-link">
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/search" className="navbar-link">
              Search
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/collections" className="navbar-link">
              Library
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/movies" className="navbar-link">
              Movies
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/tvshows" className="navbar-link">
              TV shows
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/login" className="navbar-link" onClick={logout}>
              {user ? "Sign Out" : "Login"}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
