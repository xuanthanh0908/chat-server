import express from 'express'
import { addMessage, getMessage } from '../controller/message.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = express.Router()

router.post('/getmsg', getMessage)
router.post('/addmsg', addMessage)

export default router
