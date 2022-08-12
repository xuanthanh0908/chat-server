import jwt from 'jsonwebtoken'
import { createError } from './createError.js'
export const verifyToken = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization
    if (!token) return next(createError(401, 'You are not authencated !!'))
    jwt.verify(token, process.env.SCRET_ACCESS_TOKEN, (err, result) => {
      if (err) return next(createError(403, 'You are not authorization !!'))
      req.user = result
      next()
    })
  } else return next(createError(403, 'You are not authencated !!'))
}
