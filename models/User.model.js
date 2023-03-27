const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    planetListOwned: [
      {
        type: Schema.Types.ObjectId,
        ref: "Planet",
      },
    ],
    planetListVisited: [
      {
        type: Schema.Types.ObjectId,
        ref: "Planet",
      },
    ],
    ressources: {
      metal: {
        type: Number,
        required: true,
        min: 0,
      },
      energy: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
