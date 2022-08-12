import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`Connect to MongoDB successfully on : ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
