import User from '../model/user.js'
import jwt from 'jsonwebtoken'

export const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    User.findOne({ token: refreshToken }, (err, doc) => {
      if (!doc)
        return reject({ success: false, message: 'Invalid refresh token' })

      jwt.verify(
        refreshToken,
        process.env.SCRET_REFRESH_TOKEN,
        (err, result) => {
          if (err)
            return reject({ success: false, message: 'Invalid refresh token' })
          resolve({
            userId: result.id,
            success: true,
            message: 'Valid refresh token',
          })
        },
      )
    })
  })
}
