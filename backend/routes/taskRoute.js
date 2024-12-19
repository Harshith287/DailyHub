import express from "express";
import {
  addTask,
  getTask,
  removeTask,
  getTodaysTasks,
  getUpcomingTasks,
  getCompletedTasks,
} from "../controllers/taskController.js";
import requireAuth from "../middleware/requireAuth.js";
import { updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/addTask", requireAuth, addTask);
router.get("/getTask", requireAuth, getTask);
router.delete("/removeTask", requireAuth, removeTask);
router.get("/getTodaysTasks", requireAuth, getTodaysTasks);
router.get("/getUpcomingTasks", requireAuth, getUpcomingTasks);
router.get("/getCompletedTasks", requireAuth, getCompletedTasks); // New route for completed tasks

router.put("/updateTask/:id", requireAuth, updateTask);

export default router;
