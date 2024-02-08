const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const subtaskSchema = new Schema(
  {
    task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    status: { type: Number, enum: [0, 1], default: 0 },
    deleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);
subtaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Subtask", subtaskSchema);
