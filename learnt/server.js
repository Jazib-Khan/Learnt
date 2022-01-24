const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose')
const Homework =  require('./models/homework')
const homeworkRouter = require('./routes/homeworks')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/learnt')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const homeworks = await Homework.find().sort({ createdAt: 'desc' })
        res.render('homeworks/index', { homeworks: homeworks})
    })

app.use('/homeworks', homeworkRouter)

app.use("/public", express.static(path.join(__dirname, "public")));

const botName = 'Learnt';

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Communicate with the class'));

    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    
    io.to(user.room).emit('roomUsers' , {
        room: user.room,
        users: getRoomUsers(user.room)
    });


    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers' , {
            room: user.room,
            users: getRoomUsers(user.room)
            });
        }

    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
