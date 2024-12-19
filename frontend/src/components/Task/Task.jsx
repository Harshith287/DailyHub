import React, { useState } from "react";
import moment from "moment";
import { useContext } from "react";
import TaskContext from "../../context/TaskContext";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../createTask/createTaskModal.js"; // Import the Modal component
import "./task.css"; // Assuming you have custom CSS
import TokenContext from "../../context/TokenContext";
import axios from "../../Axios/axios.js";

function Task({ task }) {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState(moment(task.date).format("YYYY-MM-DD"));
  const [time, setTime] = useState(task.time);

  const handleRemove = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.delete("/task/removeTask", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: { id: task._id }, // Send only the task ID
      });
      console.log(res.data);
      dispatch({
        type: "REMOVE_TASK",
        id: task._id, // Pass the task ID
      });
       window.location .reload(); // Reload the page to show the updated list of tasks
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkDone = async (e) => {
    e.preventDefault();
    try {
      // Toggle the 'completed' status of the task in MongoDB
      const res = await axios.put(
        `/task/updateTask/${task._id}`,
        { completed: !task.completed }, // Toggle completion status
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(res.data);
      dispatch({
        type: "MARK_DONE",
        id: task._id, // Pass the task ID
        completed: !task.completed, // Pass the new completion status
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskClick = () => {
    setShowModal(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/task/updateTask/${task._id}`,
        { title, description, date, time },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      window.location.reload();
      console.log(res.data);
      dispatch({
        type: "UPDATE_TASK",
        id: task._id,
        title,
        description,
        date,
        time,
      });
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="task-color py-4 rounded-lg shadow-md flex items-start justify-between gap-4 m-3 pb-0 pu-4 pl-4 pr-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            className="bg-black checkbox mr-3 mt-1 w-5 h-5"
            onChange={handleMarkDone}
            checked={task.completed}
          />
        </div>
        <div
          className="task-info text-slate-900 w-full flex flex-col"
          onClick={handleTaskClick}
        >
          <h4 className="task-title text-lg font-bold capitalize mb-1">
            {task.title}
          </h4>
          <p className="task-description text-sm mb-4">{task.description}</p>
          <div className="flex justify-between text-xs italic opacity-60 items-end">
            <p>
              {moment(task.date).format("MMM D, YYYY")}{" "}
              {moment(task.time, "HH:mm").format("hh:mm A")}
            </p>
            {task?.createdAt ? (
              <p>{moment(task.createdAt).fromNow()}</p>
            ) : (
              <p>just now</p>
            )}
          </div>
        </div>
        <div className="remove-task text-sm text-white">
          <DeleteIcon
            style={{ fontSize: 30, cursor: "pointer" }}
            size="small"
            onClick={handleRemove}
            className="remove-task-btn bg-red-400 rounded-full border-1 border-white p-1"
          />
        </div>
      </div>

      {showModal && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <div className="addContainer flex justify-center bg-white border-3 p-5">
            <div className="w-11/12">
              <h3 className="flex justify-center">Update Task</h3>
              <form onSubmit={handleUpdateTask}>
                <div>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="my-3">
                  <textarea
                    rows={5}
                    name="description"
                    id="description"
                    placeholder="Description"
                    value={description}
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ resize: "none" }}
                    className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={date}
                    required
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="my-3">
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={time}
                    required
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-red-600 rounded-md text-white px-7 py-2"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Task;
