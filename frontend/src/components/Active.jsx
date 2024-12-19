// components/Active.js
import React, { useContext, useEffect } from "react";
import Task from "./Task/Task";
import TaskContext from "../context/TaskContext";
import TokenContext from "../context/TokenContext";
import axios from "axios";

function Active() {
  const { tasks, dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const fetchUpcomingTasks = async () => {
    try {
      const res = await axios.get("/api/task/getUpcomingTasks", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      dispatch({ type: "SET_TASK", payload: { tasks: res.data } });
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
    }
  };

  useEffect(() => {
    

    fetchUpcomingTasks();
  }, [userToken, dispatch]);

  return (
    <div>
      {tasks.length !== 0 ? (
        tasks.map((task, index) => (
          <Task key={task._id} task={task} id={index} />
        ))
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">No Upcoming Tasks</h1>
        </div>
      )}
    </div>
  );
}

export default Active;
