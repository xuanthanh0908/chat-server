import express from 'express'
import {
  allUser,
  Login,
  refreshToken,
  Register,
  setAvatar,
  getUser,
  friends,
} from '../controller/user.js'
const router = express.Router()

router.post('/login', Login)
router.get('/user', friends)
router.post('/register', Register)
router.post('/refreshToken', refreshToken)
router.post('/setAvatar/:id', setAvatar)
router.get('/allUser/:id', allUser)
router.get('/find/:id', getUser)
export default router
