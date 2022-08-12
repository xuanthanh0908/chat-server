import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    token: {
      type: String,
    },
    friends: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('users', userSchema)
