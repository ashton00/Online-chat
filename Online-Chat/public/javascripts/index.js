
var username = '';
var usernums = 0;
var socket = io.connect();
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
  getEnterkey();
  sayTime();
}
//——————————————————————————————————————————————————

//客户端事件
//——————————————————————————————————————————————————

var addUser = function (name) {
  username = name;
  console.log('--username: ', username);
  socket.emit('add user', username);
}
var deleteUser = function(name) {
  username = '';
  socket.emit('user left', username);
}

var sendMessage = function(msg) {
  socket.emit('new message', {
    username: username,
    data: msg
  });
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
}
var oneUserJoin = function(data) {
  let str = '';
  str = data.username + ' 加入群聊'
  insertStaus(str);
  updateTop(data.usernums);
}
var oneUserLeft = function(data) {
  let str = '';
  str = data.username + ' 离开群聊'
  insertStaus(str);
  updateTop(data.usernums);
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
  $(".sendcontent").keydown(function(event) { 
      if (event.keyCode == 13) {  
        var msg = $(".sendcontent").val();
        $(".sendcontent").val('');
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
//——————————————————————————————————————————————————







