import jwt from 'jsonwebtoken'
import User from '../model/user.js'

export const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.SCRET_ACCESS_TOKEN,
      {
        expiresIn: '10s',
      },
    )
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.SCRET_REFRESH_TOKEN,
      {
        expiresIn: '30m',
      },
    )

    const userToken = await User.findById({ _id: user._id })
    if (userToken) {
      const data = { ...userToken._doc, token: refreshToken }
      await User.findByIdAndUpdate(
        user._id,
        {
          $set: data,
        },
        { new: true },
      )
    }
    return Promise.resolve({ accessToken, refreshToken })
  } catch (err) {
    return Promise.reject(err)
  }
}
