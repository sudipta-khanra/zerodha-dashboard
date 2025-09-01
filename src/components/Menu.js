
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaLaptop,
  FaEnvelope,
  FaQuestionCircle,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdKeyboard } from "react-icons/md";
import "./Menu.css";
const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dropdownRef = useRef(null);
  const handleMenuClick = (index) => setSelectedMenu(index);
  const handleProfileClick = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Fetch user data if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3002/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);
  // Login function
  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email and password");
    try {
      const res = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser({ username: data.username, email });
        setEmail("");
        setPassword("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsProfileDropdownOpen(false);
  };
  const menuClass = "menu";
  const activeMenuClass = "menu selected";
  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "40px" }} alt="logo" />
      <div className="menus">
        <ul>
          {[
            "Dashboard",
            "Orders",
            "Holdings",
            "Positions",
            "Funds",
            "Apps",
          ].map((menu, index) => (
            <li key={index}>
              <Link
                to={menu === "Dashboard" ? "/" : `/${menu.toLowerCase()}`}
                style={{ textDecoration: "none" }}
                onClick={() => handleMenuClick(index)}
              >
                <p
                  className={
                    selectedMenu === index ? activeMenuClass : menuClass
                  }
                >
                  {menu}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">
            {user ? user.username[0].toUpperCase() : "U"}
          </div>
          <p className="username">{user ? user.username : "USERID"}</p>
        </div>
        {isProfileDropdownOpen && (
          <div className="profile-dropdown" ref={dropdownRef}>
            {!user ? (
              <div className="login-form">
                <h4>Login</h4>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
              </div>
            ) : (
              <>
                <div className="profile-header">
                  <p className="profile-name">{user.username}</p>
                  <p className="profile-email">{user.email}</p>
                </div>
                <hr />
                <p>
                  <FaUser /> My profile{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <p>
                  <FaLaptop /> Console{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <p>
                  <FaEnvelope /> Coin{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <p>
                  <FaQuestionCircle /> Support{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <p>
                  <FaUserPlus /> Invite friends{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <hr />
                <p>
                  <FaLaptop /> Tour Kite{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <p>
                  <MdKeyboard /> Keyboard shortcuts{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <p>
                  <FaQuestionCircle /> Help{" "}
                  <span className="coming-soon">Coming Soon</span>
                </p>
                <hr />
                <p onClick={handleLogout} style={{ cursor: "pointer" }}>
                  <FaSignOutAlt /> Logout
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Menu;
