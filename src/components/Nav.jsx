import { useState } from "react";
import { Link } from "react-router-dom";
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
          <img src="/images/Me Movies.svg" alt="logo" />
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
            <Link to="/home" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/search" className="navbar-link">
              Search
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/collections" className="navbar-link">
              Your Catalogue
            </Link>
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
              {user ? "Sign Out" : "Login"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
