import React, { useState, useContext } from "react";
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext";
import axios from "../../Axios/axios.js";
import Modal from "./createTaskModal.js";
import "./createTask.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import AllTask from "../AllTask.jsx";

function CreateTask({ onTaskAdded }) {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showModal, setShowModal] = useState(false);

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
  

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/task/addTask",
        { title, description, date, time },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (res.status >= 200 && res.status < 300) {
        toast.success("Task added successfully!", toastOptions);
        console.log("res.data after created task",res.data);
        dispatch({
          type: "ADD_TASK",
          task: res.data, // Assuming the API returns the new task object
        });
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setShowModal(false);
        // AllTask();
        window.location.reload();
      } else {
        const errorMessage = res.data?.message || "Failed to add task. Please try again.";
        toast.error(errorMessage, toastOptions);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Failed to add task. Please try again.";
      toast.error(errorMessage, toastOptions);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md create-task-btn"
      >
        Add Task
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="addContainer flex justify-center bg-white border-3 p-5">
          <div className="w-11/12">
            <h3 className="flex justify-center">New Task</h3>
            <form onSubmit={handleAdd}>
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default CreateTask;
