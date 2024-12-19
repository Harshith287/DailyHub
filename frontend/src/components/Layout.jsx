import React from "react";
import TaskIndicator from "./TaskIndicator";
import CreateTask from "./createTask/CreateTask";
import { Outlet } from "react-router-dom";
import "./Layout.css";
function Layout() {
  return (
    <div className="todo-main">
      <div className="Todo">
        <div className="task-container">
          <div className="indicator">
            <TaskIndicator />
          </div>
          <div className="outlet">
            <Outlet />
          </div>
        </div>
        <CreateTask />
      </div>
    </div>
  );
}

export default Layout;
