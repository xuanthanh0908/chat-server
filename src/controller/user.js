import User from '../model/user.js'
import { createError } from '../middleware/createError.js'
import bcrypt from 'bcryptjs'
import { generateTokens } from '../service/genarateToken.js'
import { verifyRefreshToken } from '../service/verifyRefreshToken.js'
import jwt from 'jsonwebtoken'
export const Login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return next(createError(500, 'User not found'))
    const isCorrectPW = await bcrypt.compare(req.body.password, user.password)
    if (!isCorrectPW) return next(createError(500, 'Wrong credentials !!'))

    const { accessToken, refreshToken } = await generateTokens(user._doc)
    res.status(200).json({ userId: user._id, accessToken })
  } catch (error) {
    next(error)
  }
}

export const Register = async (req, res, next) => {
  try {
    const userName = req.body.username
    const isExist = await User.findOne({ username: userName })
    if (isExist) return next(createError(500, 'Email has been registed !!'))
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const user = new User({ ...req.body, password: hash })
    await user.save()
    res.status(200).json('user has been created !!')
  } catch (error) {
    next(error)
  }
}
export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) return next(createError(501, 'User not found !!'))
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}
export const friends = async (req, res, next) => {
  try {
    const user = await User.find()
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}
export const allUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const filterUser = await User.find({ _id: { $ne: userId } })

    res.status(200).json(filterUser)
  } catch (error) {
    next(error)
  }
}
export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id
    const avatar = req.body.avatar
    const findUser = await User.findById(userId)
    if (!findUser) return next(createError(500, 'User not found !!'))
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: avatar,
      },
      { new: true },
    )
    const { password, ...rest } = updateUser._doc
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}
export const refreshToken = async (req, res, next) => {
  try {
    const isValid = await verifyRefreshToken(req.body.refreshToken)
    if (!isValid.success) return next(createError(500, 'Invalid refresh token'))
    const accessToken = jwt.sign(
      { id: isValid.userId },
      process.env.SCRET_ACCESS_TOKEN,
      {
        expiresIn: '30s',
      },
    )
    res.status(200).json({
      token: accessToken,
    })
  } catch (error) {
    console.log('error')
    next(error)
  }
}
