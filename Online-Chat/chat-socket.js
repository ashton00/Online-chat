const user = require('./user');
//add user
//login
//send message
//receive message
//log out
var usernums = 0;
exports.start = (io) => {
  console.log('start');
  io.on('connection', (socket) => {
    //new message
    socket.on('new message', data => {
      console.log('--onlog: new message, ', data);
      socket.broadcast.emit('new message', {
        username: socket.username,
        data: data.data
      });
    });
    //add user
    socket.on('add user', username => {
      console.log('--onlog: add user, ', username);
      if(user.isExist(username)) {
        socket.emit('user exist', {
          username: username
        });
      } else {
        user.addUser(username);
        socket.username = username;
        usernums++;
        socket.emit('log in', {
          usernums: usernums
        });

        socket.broadcast.emit('user join', {
          usernums: usernums,
          username: socket.username
        });
    }

    });
    //log out
    socket.on('log out', username => {
      user.deleteUser(username);
      console.log('--onlog: log out, ', username);
      usernums--;
      socket.broadcast.emit('user left', {
        usernums: usernums,
        username: socket.username
      });
    });
  });

}