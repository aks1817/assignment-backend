const Subtask = require("../models/subtask");
const Task = require("../models/task");

exports.createSubtask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const user = req.user;

    // Find the task
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user has permission to create a subtask for this task
    if (task.user != user) {
      return res
        .status(403)
        .json({ error: "Unauthorized to create a subtask for this task" });
    }

    // Create the subtask for the task
    const subtask = await Subtask.create({ task_id });
    res.status(201).json(subtask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllSubtasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user_id = req.user; // Extract user ID from request params

    // Find all tasks for the user
    const tasks = await Task.find({ user: user_id, deleted: false }).select(
      "_id"
    );

    // Extract task IDs from the tasks array
    const taskIds = tasks.map((task) => task._id);

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { created_at: -1 },
    };

    // Find all subtasks for the user's tasks
    const query = { task_id: { $in: taskIds }, deleted: false };

    const subtasks = await Subtask.paginate(query, options);
    res.status(200).json(subtasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubtask = async (req, res) => {
  try {
    const { subtask_id } = req.params;
    const { status } = req.body;
    const user = req.user;

    // Find the subtask by ID
    const subtask = await Subtask.findById(subtask_id);
    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    // Find the task associated with the subtask
    const task = await Task.findById(subtask.task_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the task belongs to the authenticated user
    if (task.user != user) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this subtask" });
    }

    // Update the subtask status
    const updatedSubtask = await Subtask.findByIdAndUpdate(
      subtask_id,
      { status },
      { new: true }
    );
    if (status === 1) {
      // Update the status of the task to "IN_PROGRESS"
      await Task.findByIdAndUpdate(task._id, { status: "IN_PROGRESS" });
    }
    res.json(updatedSubtask);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSubtask = async (req, res) => {
  try {
    const { subtask_id } = req.params;
    const user = req.user;

    // Find the subtask by ID
    const subtask = await Subtask.findById(subtask_id);
    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    // Find the task associated with the subtask
    const task = await Task.findById(subtask.task_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the task belongs to the authenticated user
    if (task.user != user) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this subtask" });
    }

    // Soft delete the subtask
    const updatedSubtask = await Subtask.findByIdAndUpdate(
      subtask_id,
      { deleted: true },
      { new: true }
    );
    res.json({ message: "Subtask soft deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
