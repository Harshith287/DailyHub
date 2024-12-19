import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import cron from "node-cron";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendMail = (email, subject, title, description) => {
  const mailOptions = {
    from: "thedailyhub@gmail.com",
    to: email,
    subject: `Task Reminder`,
    html: `<h2>Title: ${title}</h2><h3>Description: ${description}</h3>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error in taskController.js at sendMail func"+error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
// const scheduleReminder = (task) => {
//   const taskTime = new Date(`${task.date}T${task.time}`);
//   const reminderTime = new Date(taskTime.getTime() - 60 * 60 * 1000); // 1 hour before task time
//   const currentTime = new Date();
//   const timeDifference = reminderTime.getTime() - currentTime.getTime();

//   if (timeDifference > 0) {
//     setTimeout(() => {
//       sendMail(task.userEmail, "Task Reminder", task.title, task.description);
//     }, timeDifference);
//   }
// };

const addTask = async (req, res) => {
  console.log("Adding task");
  const { title, description, date, time } = req.body;
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    // console.log(user)

    const newTask = new taskModel({
      title,
      description,
      date,
      time,
      completed: false,
      userId,
      userEmail: user.email,
    });

    await newTask.save();
    sendMail(user.email, "Task added successfully", title, description, date, time);

    //scheduleReminder(newTask);

    res.status(200).json(newTask);
  } catch (error) {
    console.error("Error adding task", error);
    res.status(500).json({ message: error.message });
  }
};

const removeTask = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  try {
    const task = await taskModel.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task removed successfully" });
  } catch (error) {
    console.error("Error removing task", error);
    res.status(500).json({ message: "Error removing task", error });
  }
};

const getTask = (req, res) => {
  taskModel
    .find({ userId: req.user.id })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(501).json({ message: error.message }));
};



export const getTodaysTasks = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  console.log("Today: " + today.toISOString());

  const tomorrow = new Date(today);
  
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log("Tomorrow: " + tomorrow.toISOString());

  try {
    const tasks = await taskModel
      .find({
        userId: userId,
        date: {
          $gte: today.toISOString(),
          $lt: tomorrow.toISOString(),
        },
        completed: false,
      })
      .sort({ time: 1 });

    console.log("Retrieved tasks: ", tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving today's tasks: ", error);
    res.status(500).json({ message: "Error retrieving today's tasks", error });
  }
};


export const getUpcomingTasks = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  try {
    const tasks = await taskModel
      .find({
        userId: userId,
        date: {
          $gte: tomorrow.toISOString(),
        },
        completed: false,
      })
      .sort({ date: 1, time: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving upcoming tasks: ", error);
    res.status(500).json({ message: "Error retrieving upcoming tasks", error });
  }
};

export const getCompletedTasks = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const tasks = await taskModel
      .find({
        userId: userId,
        $or: [
          { completed: true },
          { date: { $lt: today.toISOString() } },
        ],
      })
      .sort({ date: -1, time: -1 });

    console.log("Retrieved tasks: ", tasks); // Add logging here
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving completed tasks: ", error);
    res.status(500).json({ message: "Error retrieving completed tasks", error });
  }
};


export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const task = await taskModel.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

export { addTask, getTask, removeTask };
