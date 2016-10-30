
var username = '';
var usernums = 0;
var socket = io.connect();
var someone = '';
var flag = 0;



//页面操作
//——————————————————————————————————————————————————
  $('.total').hide();
  $('.surebtn').click(function() {
    username = $('.username').val();
    addUser(username);
  }); 
  $('.logout').mouseover(function () {
    $('.logout')[0].innerHTML = '×';
  });
  $('.logout').mouseout(function () {
    $('.logout')[0].innerHTML = '';
  });
  $('.logout').click(function() {
    logout(username);
    $('.total').slideUp("slow");
    $('.register').slideDown("slow");
    username = '';
  });

  var login = function () {
    username = $('.username').val();
    console.log('username: ', username);
    $('.total').slideDown("slow");
    $('.register').slideUp("slow");
    init();
  }

  var loginFailed = function () {
    username = '';
    alert('登陆失败，当前用户名已存在');
  }

  var logout = function (name) {
    socket.emit('log out', name);
  }
  var init = function () {
    console.log(flag);
    if(flag == 0) {
      getEnterkey();
      getEnterkey1();
      flag = 1;
    }
    talkToAll();
    sayTime();
    getUserlist();
  }
      // var insertContent = function(data) {
      //   var initTime = new Date(data.timestamp);
      //   initTime = initTime.toLocaleTimeString();

      //   var temp =
      //     '<div class=\"chat-message\">' +
      //     '    <img class=\"message-avatar-right\" src=\"' + user.avatar + '\" alt=\"\">' +
      //     '    <div class=\"message-right\">' +
      //     '        <a class=\"message-author\"> ' + user.name + '</a>' +
      //     '        <span class=\"message-date-right\"> ' + initTime + ' </span>' +
      //     '        <span class=\"message-content\">' + data.body + '</span>' +
      //     '    </div>' +
      //     '</div>';
      //   $('.chat-discussion').append(temp);
      //   scrollToEnd();
      // }
      // 
  var initUserlist = function(userlist) {
    $total = $('.usercontent');
    for (var oneuser of userlist) {
      var name = '.'+oneuser;
      if(oneuser == username)
        continue;
      if($(name).length == 0) {
         var avatar_num = oneuser.length % 1 + 1;
        var temp = 
          '<div class="oneuser '+ oneuser+' " onclick="choseToTalk(\''+ oneuser +'\')"> '+
          '  <img src="avatar/'+ avatar_num +'.jpg" class="avatar">'+
          '  <span class="name">'+ oneuser +'</span>'+
          '</div>';
        $total.append(temp);   
      }
    }
  }

  var addOneUserToUserlist = function(oneuser) {
      if(oneuser == username)
        return;
      var avatar_num = oneuser.length % 1 + 1;
      var temp = 
        '<div class="oneuser '+ oneuser+'" onclick="choseToTalk(\''+ oneuser +'\')"> '+
        '  <img src="avatar/'+ avatar_num +'.jpg" class="avatar">'+
        '  <span class="name">'+ oneuser +'</span>'+
        '</div>';
      $('.usercontent').append(temp);
  }

  var deleteOneUserFromUserlist = function(oneuser) {
      var name = '.'+oneuser;
      $((name)).remove();
  }
//——————————————————————————————————————————————————




//服务端事件处理函数
//——————————————————————————————————————————————————
  var getNewMessage = function(data) {
    let str = '';
    str = data.username + ' : ' + data.data;
    insertContent(str);
  }
  var userLogin = function(data) {
    let str = '';
    str = username + ' 加入群聊'
    insertStaus(str);
    usernums = data.usernums;
    updateTop(usernums);
    deleteOneUserFromUserlist(data.username);
  }
  var oneUserJoin = function(data) {
    let str = '';
    str = data.username + ' 加入群聊'
    insertStaus(str);
    updateTop(data.usernums);
    deleteOneUserFromUserlist(data.username);
    addOneUserToUserlist(data.username);
  }

  var oneUserLeft = function(data) {
    let str = '';
    str = data.username + ' 离开群聊';
    str1 = data.username + ' 已经离开';
    insertStaus(str);
    insertStaus1(str1);
    updateTop(data.usernums);
    deleteOneUserFromUserlist(data.username);
  }
//——————————————————————————————————————————————————

//工具函数
//——————————————————————————————————————————————————
  var insertStaus = function(str) {
    let temp = '<div class="outer"><span class="status">'+ str + '</span></div>';
    console.log('--str: ', str);
    // $('.chatcontent').children().last().after(temp).addClass('stuas');
    $('.chattext').append(temp);
    scrollToTheEnd();
  }

  var insertContent = function(str) {
    let temp = '<div class="outer"><div class="content">'+ str + '</div></div>';
    // $('.chatcontent').children().last().after(temp).addClass('content');
    $('.chattext').append(temp);
    scrollToTheEnd();
  }

  var addOwnWord = function(data) {
    let str = '';
    str = data.username + ' : ' + data.data;
    let temp = '<div class="outer"><div class="mycontent">'+ str + '</div></div>';
    // $('.chatcontent').children().last().after(temp).addClass('content');
    $('.chattext').append(temp);
    scrollToTheEnd();
  }

  var updateTop = function(num) {
    let str = 'User: '+ username + ', Online User Nums: ' + num;
    $('.top').html(str);
  }

  var sayTime = function() {
    setInterval(function () {
      var date = new Date();
      var str = '';
      str = date.toLocaleTimeString()
      insertStaus(str);
    }, 60000);
  }

  var getEnterkey = function () {
    console.log("getEnterkey");
    $(".sendcontent").keydown(function(event) { 
        if (event.keyCode == 13) {  
          var msg = $(".sendcontent").val();
          setTimeout(function() {
            $(".sendcontent").val('');
          }, 0);
          sendMessage(msg);
          addOwnWord({username: username, data: msg});
        }  
    })  
  }

  var scrollheigth = 0;
  var scrollToTheEnd = function () {
    scrollheigth += 55;
    $('.chattext').scrollTop(scrollheigth);
  }
  var showScroll = function () {
    if(document.addEventListener) 
      document.addEventListener('DOMMouseScroll',scrollFunc,false);
    $('.chattext').onmousewheel=document.onmousewheel=scrollFunc;
  }
//——————————————————————————————————————————————————

//工具函数

  var getNewMessage = function(data) {
    let str = '';
    str = data.username + ' : ' + data.data;
    insertContent(str);
  }
  var userLogin = function(data) {
    let str = '';
    str = username + ' 加入群聊'
    insertStaus(str);
    usernums = data.usernums;
    updateTop(usernums);
    deleteOneUserFromUserlist(data.username);
  }
  var oneUserJoin = function(data) {
    let str = '';
    str = data.username + ' 加入群聊'
    insertStaus(str);
    updateTop(data.usernums);
    deleteOneUserFromUserlist(data.username);
    addOneUserToUserlist(data.username);
  }

  var oneUserLeft = function(data) {
    let str = '';
    str = data.username + ' 离开群聊'
    insertStaus(str);
    updateTop(data.usernums);
    deleteOneUserFromUserlist(data.username);
  }
//——————————————————————————————————————————————————

//工具函数2
//——————————————————————————————————————————————————
  var insertStaus1 = function(str) {
    let temp = '<div class="outer"><span class="status">'+ str + '</span></div>';
    console.log('--str: ', str);
    // $('.chatcontent').children().last().after(temp).addClass('stuas');
    $('.chattext1').append(temp);
    scrollToTheEnd1();
  }

  var insertContent1 = function(str) {
    let temp = '<div class="outer"><div class="content">'+ str + '</div></div>';
    // $('.chatcontent').children().last().after(temp).addClass('content');
    $('.chattext1').append(temp);
    scrollToTheEnd1();
  }

  var addOwnWord1 = function(data) {
    let str = '';
    str = data.username + ' : ' + data.data;
    let temp = '<div class="outer"><div class="mycontent">'+ str + '</div></div>';
    // $('.chatcontent').children().last().after(temp).addClass('content');
    $('.chattext1').append(temp);
    scrollToTheEnd1();
  }

  var updateTop1 = function(num) {
    let str = 'User: '+ someone;
    $('.top1').html(str);
  }

  var getEnterkey1 = function () {
    console.log("getEnterkey1 ");
    $(".sendcontent1").keydown(function(event) { 
        if (event.keyCode == 13) {  
          var msg = $(".sendcontent1").val();
          setTimeout(function() {
            $(".sendcontent1").val('');
          }, 0);
          sendMessageToSomeone(msg);
          addOwnWord1({username: username, data: msg});
        }  
    })  
  }

  var sayTime1 = function() {
    setInterval(function () {
      var date = new Date();
      var str = '';
      str = date.toLocaleTimeString()
      insertStaus1(str);
    }, 60000);
  }


  var scrollheigth1 = 0;
  var scrollToTheEnd1 = function () {
    scrollheigth1 += 55;
    $('.chattext1').scrollTop(scrollheigth);
  }
  var showScroll1 = function () {
    if(document.addEventListener) 
      document.addEventListener('DOMMouseScroll',scrollFunc,false);
    $('.chattext1').onmousewheel=document.onmousewheel=scrollFunc;
  }
//——————————————————————————————————————————————————


var addMessageToSomeone = function(data) {
    console.log('addMessageToSomeone');
    console.log(data);
    let messagelist = data.messagelist;
    for(var i = 0; i < messagelist.length; i++) {
      var item = messagelist[i];
      if(username == item.someone && someone == item.username)
        insertContent1(item.msg);
      if(username == item.username && someone == item.someone)
        addOwnWord1(item.msg);
    }
}


var choseToTalk = function(people) {
  $('.total').hide();
  $('.total1').show();
  $('.chattext1').empty();
  someone = people;
  updateTop1();
  checkmessage();
}

var talkToAll = function () {
  $('.total').show();
  $('.total1').hide();
}
//客户端事件
//——————————————————————————————————————————————————

var addUser = function (name) {
  username = name;
  console.log('--username: ', username);
  socket.emit('add user', username);
}
// var deleteUser = function(name) {
//   socket.emit('user left', username);
// }

var sendMessage = function(msg) {
  socket.emit('new message', {
    username: username,
    data: msg
  });
}

var getUserlist = function() {
  socket.emit('get user list', username);
}


var checkmessage = function() {
  console.log('check message:', someone);
  socket.emit('check message', {
    username: username,
    someone: someone
  });
}

var sendMessageToSomeone = function(msg) {
  console.log('sendMessageToSomeone', someone);
  socket.emit('talk to someone', {
    msg: msg,
    username: username,
    someone: someone
  })
}
//——————————————————————————————————————————————————



//服务端事件监听器
//——————————————————————————————————————————————————
socket.on('new message', function(data) {
  console.log('---new message');
  getNewMessage(data);
});

socket.on('log in', function(data) {
  console.log('---login in');
  usernums = data.usernums;
  userLogin(data);
  login();
});

socket.on('user join', function(data) {
  console.log('---user login');
  oneUserJoin(data);
});

socket.on('user left', function(data) {
  console.log('---user left');
  updateTop(data.usernums);
  oneUserLeft(data);
});

socket.on('user exist', function(data) {
  console.log('---user exist');
  loginFailed();
});

socket.on('user list', function(data) {
  console.log('----user list');
  let userlist = data.userlist.allUser;
  console.log(userlist);
  initUserlist(userlist);
})

socket.on('new talk message', function(data) {
  addMessageToSomeone(data);
});

socket.on('check message', function(data) {
  if(data.someone == someone && data.username == username) {
    checkmessage();
  }
})

//——————————————————————————————————————————————————





