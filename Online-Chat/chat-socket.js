const user = require('./user');
//add user
//login
//send message
//receive message
//log out
var usernums = 0;

var messagelist = [];

exports.start = (io) => {
  console.log('start');
  io.on('connection', (socket) => {
    socket.on('new message', data => {
      var username = data.username;
      console.log('--onlog: new message, ', data);
      socket.broadcast.emit('new message', {
        username: username,
        data: data.data
      });
    });
    //add user
    socket.on('add user', username => {
      console.log('--onlog: add user, ', username);
      if(user.isExist(username)) {
        // socket.emit('user exist', {
        //   username: username
        // });
        socket.emit('log in', {
          usernums: usernums
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
        username: username
      });
    });


    socket.on('get user list', username => {
      console.log('--onlog: get user list');
      let userlist = user.getUserlist();
      socket.emit('user list', {
        userlist: userlist
      });
    });

    socket.on('talk to someone', data => {
      console.log('--onlog: talk to someone');
      let message       = {};
      message.msg       = data.msg;
      message.username  = data.username;
      message.someone   = data.someone;
      messagelist.push(message);
      socket.broadcast.emit('check message', {
        username: message.someone,
        someone: message.username
      });
    });

    socket.on('check message', data => {
      console.log('--onlog: check message');
      let mymessagelist = [];
      let username = data.username;
      let someone  = data.someone;
      messagelist.forEach((msg, index) => {
        if(username == msg.someone) {
          mymessagelist.push(msg);
          messagelist.splice(index, 1);
        }
      });

      console.log('--emit: new talk message');
      console.log(mymessagelist);
      socket.emit('new talk message', {
        messagelist: mymessagelist
      });
    });

  });

}