const ADD_TASK = "ADD_TASK";
const SET_TASK = "SET_TASK";
const REMOVE_TASK = "REMOVE_TASK";
const MARK_DONE = "MARK_DONE";
const UPDATE_TASK = "UPDATE_TASK";

function taskReducer(tasks= [], action) {
  // console.log("taskReducer", action);

  switch (action.type) {
    case ADD_TASK: {
      const { task } = action.task;
      console.log("In addTask inside taskReducer.js", tasks);
      return [
        ...tasks,
        task,
      ];
    }
    case SET_TASK:
      return Array.isArray(action.payload.tasks) ? action.payload.tasks : tasks;

    case REMOVE_TASK:
      return tasks.filter((task) => task._id !== action.id);

    case MARK_DONE:
      return tasks.map((task) => {
        if (task._id === action.id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });

    case UPDATE_TASK:
      return tasks.map((task) => {
        if (task._id === action.id) {
          return {
            ...task,
            title: action.title,
            description: action.description,
            date: action.date,
            time: action.time,
          };
        }
        return task;
      });

    default:
      return tasks;
  }
}

export default taskReducer;
