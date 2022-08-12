import { createError } from '../middleware/createError.js'
import Message from '../model/message.js'

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body
    const newMessage = new Message({
      message: { text: message },
      users: [from, to],
      sender: from,
    })
    newMessage.save()
    res.status(200).json('Message add successfully !!')
  } catch (error) {
    next(error)
  }
}
export const getMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body
    const message = await Message.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 })
    if (!message) return next(createError(500, 'The message dont exist !!'))
    const resJson = message.map((item) => {
      return {
        fromSelf: item.sender.toString() === from,
        message: item.message.text,
      }
    })
    res.status(200).json(resJson)
  } catch (error) {
    next(error)
  }
}
