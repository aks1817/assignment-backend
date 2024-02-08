const Task = require("../models/task");
const { calculatePriority } = require("../utility/utility");

const Subtask = require("../models/subtask");

exports.createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const user = req.user;
    const priority = calculatePriority(due_date);
    const task = await Task.create({
      title,
      description,
      due_date,
      priority,
      user,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, priority } = req.query;
    const userId = req.user;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { created_at: -1 },
    };
    //returns only not deleted data
    let query = { user: userId, deleted: false };
    if (priority) {
      query.priority = parseInt(priority, 10);
    }
    const tasks = await Task.paginate(query, options);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { due_date, status } = req.body;
    const user = req.user;
    const priority = due_date ? calculatePriority(due_date) : undefined;
    const task = await Task.findById(task_id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user has permission to update the task
    if (task.user != user) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this task" });
    }

    let updatedTask;
    if (status === "DONE") {
      // If task status is set to 'DONE', update all subtasks status to '1' (complete)
      updatedTask = await Task.findByIdAndUpdate(
        task_id,
        { due_date, status, priority },
        { new: true }
      );
      await Subtask.updateMany({ task_id: task_id }, { status: 1 });
    } else {
      // Otherwise, update the task with provided data
      updatedTask = await Task.findByIdAndUpdate(
        task_id,
        { due_date, status, priority },
        { new: true }
      );
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const user = req.user;

    // Find the task
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user has permission to delete the task
    if (task.user != user) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this task" });
    }

    // Soft delete the task and its subtasks
    await Task.updateOne({ _id: task_id }, { deleted: true }); // Soft delete the task
    await Subtask.updateMany({ task_id: task_id }, { deleted: true }); // Soft delete all subtasks of the task

    res.json({ message: "Task and its subtasks soft deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
