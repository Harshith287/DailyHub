// import mongoose from "mongoose";
// const taskInstance = mongoose.Schema({
//     title:{type:String, required:true},
//     description:{type:String, required:true},
//     date:{type:Date, required:true},
//     time:{type:String, required:true},
//     completed:{type:Boolean, required:true},
//     userId:{type:String, required:true}
// }, {timestamps:true});

// const taskModel = mongoose.model("Task", taskInstance);
// export default taskModel;

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true },
  reminderSent: { type: Boolean, default: false }
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;
