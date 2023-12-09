const socket = io()
const user_name = document.getElementById('name')
const login_button = document.getElementById('login')


const login = ()=>{
    if(user_name.value.length >= 1){
        console.log(user_name.value.length)
        socket.emit('check_user_exist', user_name.value, isExist => {
            console.log()
        })
    }
}
login_button.addEventListener('click',()=>{
    console.log(2)
    login()
})

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 保存已存在的用户名
const existingUsernames = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // 监听用户加入请求
    socket.on('join', (username, callback) => {
        // 检查用户名是否已存在
        if (existingUsernames.includes(username)) {
            callback({ success: false, message: '用户名已存在，请选择其他用户名' });
        } else {
            // 将新用户名添加到列表
            existingUsernames.push(username);
            // 将用户加入聊天室
            socket.username = username;
            socket.join('chatroom');
            io.emit('chat message', `${username} 加入了聊天室`);
            callback({ success: true, message: '成功加入聊天室' });
        }
    });

    // 监听聊天消息
    socket.on('chat message', (msg) => {
        io.to('chatroom').emit('chat message', `${socket.username}: ${msg}`);
    });

    // 监听用户断开连接
    socket.on('disconnect', () => {
        if (socket.username) {
            // 从列表中移除断开连接的用户
            const index = existingUsernames.indexOf(socket.username);
            if (index !== -1) {
                existingUsernames.splice(index, 1);
            }
            io.emit('chat message', `${socket.username} 离开了聊天室`);
        }
    });
});

// 设置服务器端口
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

