const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const chatRoutes = require('./routes/chatRoutes')
const adminRoutes = require('./routes/adminRoutes')
const notificationRoutes = require('./routes/notificationsRoutes')
const eventRoutes = require('./routes/eventRoutes')

dotenv.config()
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/chat', chatRoutes)
app.use('/admin', adminRoutes)
app.use('/notifications', notificationRoutes)
app.use('/events', eventRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to StudentConnect!!')
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}.`)
})
