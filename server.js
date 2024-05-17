const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const chatRoutes = require('./routes/chatRoutes')
const User = require('./models/users')
const adminRoutes = require('./routes/adminRoutes')
const notifyrouter = require('./routes/notifcations')
const profilerouter = require('./routes/profille')

dotenv.config()
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/chat', chatRoutes)
app.use('/admin', adminRoutes)
<<<<<<< HEAD
app.use('/notifications', notifyrouter)

// Socket.io for real-time chat
io.on('connection', socket => {
  console.log('User connected:', socket.id)

  socket.on('go-online', userId => {
    socket.join(userId)
    User.findByIdAndUpdate(userId, { onlineStatus: true }, err => {
      if (err) console.log('Error setting user online:', err)
      io.emit('user-online', userId)
    })
  })

  socket.on('send-message', message => {
    const { senderId, receiverId, text } = message
    io.to(receiverId).emit('receive-message', { senderId, text })
    // saving the message here via chatController
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    // Optionally, set user offline in the database
  })
})

app.get('/', (req, res) => {
  res.send('Welcome to StudentConnect!!')
})
=======
app.use('/notification',notifyrouter)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    server.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  })
  .catch(err => console.log(err))
