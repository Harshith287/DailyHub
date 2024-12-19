import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Task from "./Task/Task";
import TokenContext from "../context/TokenContext";

function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const { userToken } = useContext(TokenContext); // Assuming you have a userToken in your context

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await axios.get("/api/task/getCompletedTasks", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setCompletedTasks(res.data);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      }
    };

    fetchCompletedTasks();
  }, [userToken]);

  return (
    <div>
      {completedTasks.length > 0 ? (
        completedTasks.map((task, index) => (
          <Task key={task._id} task={task} id={index} completed={task.completed} />
        ))
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold">No Completed Tasks Found</h1>
        </div>
      )}
    </div>
  );
}

export default CompletedTasks;
