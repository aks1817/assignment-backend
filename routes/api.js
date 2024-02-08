const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

// Import controllers
const taskController = require("../controllers/taskController");
const subtaskController = require("../controllers/subtaskController");
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");

// Task routes
router.post("/tasks", authenticate, taskController.createTask);
router.post(
  "/tasks/:task_id/subtasks",
  authenticate,
  subtaskController.createSubtask
);
router.get("/tasks/all", authenticate, taskController.getAllTasks);
router.get("/tasks/subtasks", authenticate, subtaskController.getAllSubtasks);
router.patch("/tasks/update/:task_id", authenticate, taskController.updateTask);
router.patch(
  "/tasks/subtasks/:subtask_id",
  authenticate,
  subtaskController.updateSubtask
);
router.delete(
  "/tasks/delete/:task_id",
  authenticate,
  taskController.deleteTask
);
router.delete(
  "/tasks/subtasks/:subtask_id",
  authenticate,
  subtaskController.deleteSubtask
);

// User routes
router.post("/users", userController.createUser);
router.get("/users", authenticate, userController.getAllUsers);

//Login route
router.get("/login", loginController.login);

module.exports = router;
