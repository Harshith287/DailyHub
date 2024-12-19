import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const styles = {
  base: {
    textDecoration: "none",
    color: "#171717",
    fontWeight: "bold",
    // transition: 'all 0.3s ease-in-out',
  },
};

const navItems = [
  { path: "/", label: "Today" },
  { path: "/active", label: "Upcoming" },
  { path: "/completed", label: "Completed" },
];

function TaskIndicator() {
  const location = useLocation();

  const getActiveIndex = () => {
    return navItems.findIndex((item) => item.path === location.pathname);
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="w-screen p-3 shadow-2xl] relative  rounded-lg">
      <nav>
        <ul className="flex justify-between align-center w-full mb-0 pb-0">
          {navItems.map((item, index) => (
            <li key={item.path} className="flex-grow text-center">
              <NavLink
                to={item.path}
                className="block"
                style={({ isActive }) =>
                  isActive
                    ? { ...styles.base, ...styles.active }
                    : { ...styles.base, ...styles.inactive }
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div
          className="absolute bottom-0 left-0 h-1 bg-black transition-all duration-300"
          style={{
            width: `${100 / navItems.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </nav>
    </div>
  );
}

export default TaskIndicator;
