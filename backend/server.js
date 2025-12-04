import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import taskModel from "./models/taskModel.js";
import noteroutes from './routes/notes.js';
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import transactionRoutes from "./routes/Transactions.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";
import { createTransport } from "nodemailer";

dotenv.config();

// express app
const app = express();
mongoose.set('strictQuery', true);

const allowedOrigins = [
  "*",
  // "https://thedailyhub.com"
];

// middleware
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(req.path, req.method, "In server.js");
  next();
});

// routes
app.use('/api/notes', noteroutes);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/v1", transactionRoutes);
app.use("/api/forgotPassword", forgotPasswordRouter);

// connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to DB & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Email reminder function
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
    subject:subject,
    html: `<h2>Title: ${title}</h2><h3>Description: ${description}</h3>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error in server.js at sendMail func"+error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Scheduler to check for tasks every minute
cron.schedule('* * * * *', async () => {
  const currentTime = new Date();
  const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour later

  const tasks = await taskModel.find({ reminderSent: false });

  tasks.forEach((task) => {
    const taskTime = new Date(`${task.date}T${task.time}`);
    
    if (taskTime <= oneHourLater && taskTime > currentTime && !task.reminderSent) {
      sendMail(task.userEmail, "Task Reminder", task.title, task.description);
      task.reminderSent = true;
      task.save();
    }
  });
});
