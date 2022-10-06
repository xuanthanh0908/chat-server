import express from 'express'
import dotenv, { config } from 'dotenv'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './src/routes/user.js'
import messageRoutes from './src/routes/message.js'
import { connectDB } from './src/connection/connect.js'
import { Server } from 'socket.io'

const app = express()
// config file env
dotenv.config({ path: '.env' })
const PORT = process.env.PORT || 4000

// config middleware
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(morgan('tiny'))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

// Handle Error
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'something went wrong !!'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})
const server = app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on port: ${PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: 'http:localhost:3000',
  },
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })
  socket.on('send-msg', (data) => {
    // console.log(onlineUsers)
    const isOnline = onlineUsers.get(data.to)
    // console.log(isOnline)
    if (isOnline) {
      socket.to(isOnline).emit('msg-recieve', data.msg)
    }
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnected')
  })
})
