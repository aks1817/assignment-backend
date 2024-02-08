const cron = require("node-cron");
const Task = require("../models/task");
const User = require("../models/user");
const { calculatePriority } = require("../utility/utility");
const twilio = require("twilio");

// 0 10 * * *
cron.schedule("0 10 * * *", async () => {
  console.log("Running....");
  try {
    const tasks = await Task.find();
    tasks.forEach(async (task) => {
      task.priority = calculatePriority(task.due_date);
      await task.save();
    });
    console.log("Task priorities updated");
  } catch (error) {
    console.error("Error updating task priorities:", error.message);
  }
});

let currentUserIndex = 0;

// Cron job for voice calling using Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
cron.schedule("* 10 * * *", async () => {
  try {
    // Fetch tasks that have passed their due dates
    const overdueTasks = await Task.find({
      due_date: { $lt: new Date() },
      status: "TODO" || "IN_PROGRESS",
    });

    if (overdueTasks.length === 0) {
      console.log("No overdue tasks. Skipping voice calls.");
      return;
    }

    // Fetch users and sort them based on priority
    const users = await User.find().sort({ priority: 1 });

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    while (currentUserIndex < users.length) {
      const user = users[currentUserIndex];

      // Initiate call to the user
      const call = await client.calls.create({
        to: `+91${user.phone_number}`,
        from: "+16592667610",
        url: "http://demo.twilio.com/docs/voice.xml",
      });
      console.log(
        `Voice call initiated for user ${user.priority} with Call SID: ${call.sid}`
      );

      // Check the status of the call after 30 seconds
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait for 30 seconds

      const updatedCall = await client.calls(call.sid).fetch();
      if (updatedCall.status !== "completed") {
        // Move to the next user if the call is not completed (i.e., not answered)
        currentUserIndex++;
      } else {
        // If call was completed, exit the loop
        break;
      }
    }

    // Reset currentUserIndex if all users have been called
    if (currentUserIndex >= users.length) {
      currentUserIndex = 0;
    }
  } catch (error) {
    console.error("Error initiating voice calls:", error.message);
  }
});
