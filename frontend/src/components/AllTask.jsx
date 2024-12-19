import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Task from "./Task/Task";
import TaskContext from "../context/TaskContext";
import TokenContext from "../context/TokenContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AllTask() {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext); // Assuming you have a userToken in your context
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const fetchTodaysTasks = async () => {
    try {
      const res = await axios.get("/api/task/getTodaysTasks", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // console.log("res.data: ", res.data);
      setTodaysTasks(res.data);
      // toast.success("Today", toastOptions);
    } catch (error) {
      toast.error("Error fetching today's tasks.", toastOptions);
      console.error("Error fetching today's tasks:", error);
    }
  };

  useEffect(() => {
    fetchTodaysTasks();
  }, [userToken]);

  const handleRemove = (taskId) => {
    dispatch({ type: "REMOVE_TASK", id: taskId });
    setTodaysTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  const handleToggleDone = (taskId) => {
    dispatch({ type: "MARK_DONE", id: taskId });
    setTodaysTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div>
      {todaysTasks.length !== 0 ? (
        todaysTasks.map((task, index) => (
          <Task key={task._id} task={task} id={index} onRemove={handleRemove} onToggleDone={handleToggleDone} />
        ))
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">No Task Today</h1>
        </div>
      )}
    </div>
  );
}

export default AllTask;
