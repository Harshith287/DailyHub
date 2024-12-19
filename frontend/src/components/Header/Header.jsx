import React, { useContext } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import TokenContext from "../../context/TokenContext.js";
import "./header.css";

function Header() {
  const token = localStorage.getItem("authToken");
  const { user } = useContext(TokenContext);
  // console.log("user", user);

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const location = useLocation();

  const isTodoActive = () => {
    return (
      location.pathname === "/" ||
      location.pathname === "/active" ||
      location.pathname === "/completed"
    );
  };

  return (
    <div>
      <nav className="header">
        <div className="app-name">
          <NavLink className="app-name-component" to="/">
            The Daily Hub
          </NavLink>
        </div>
        <div className="app-component-btns">
          {token ? (
            <div className="component-container">
              <ul className="components-list">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive || isTodoActive()
                        ? "component active"
                        : "component"
                    }
                    to="/"
                  >
                    To Do
                  </NavLink>
                </li>
                <li>
                  <NavLink className="component" to="/notes">
                    Notes
                  </NavLink>
                </li>
                <li>
                  <NavLink className="component" to="/expense">
                    Expense Tracker
                  </NavLink>
                </li>
                <li>
                  <NavLink className="component" to="/weather">
                    Weather
                  </NavLink>
                </li>
              </ul>
              <div className="header-last">
                <p className="welcome-text">
                  Welcome, {token ? user.name : "Vikram"}
                </p>
                <button onClick={logout} className="logout">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <ul className="flex justify-end gap-3 w-3/4 pr-6">
              <li>
                <NavLink className="component" to="/login">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink className="component" to="/register">
                  Register
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Header;
