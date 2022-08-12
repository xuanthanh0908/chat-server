import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        required: true,
        type: String,
      },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('messages', messageSchema)
