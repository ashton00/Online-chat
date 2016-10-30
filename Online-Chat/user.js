const fs = require('fs');

const file = {
  userFile: './data/user.json'
}
var userlist = {
  userNums: 0,
  allUser: []
}

exports.readUserList = () => {
  console.log('----readUserList');
  let content;
  content = fs.readFileSync(file.userFile);
  content = JSON.parse(content);
  userlist.userNums = content.userNums;
  userlist.allUser = userlist.allUser;
}

writeUserList = () => {
  let content = JSON.stringify(userlist);
  let buffer = new Buffer(content);
  let status = fs.writeFileSync(file.userFile, buffer);
  if(status) {
    console.log('----写入user.json失败');
  } else {
    console.log('----写入user.json成功');
  }
}

exports.addUser = (username) => {
  console.log(username);
  console.log(userlist.allUser);
  userlist.Nums++;
  userlist.allUser.push(username);
  writeUserList();
  console.log(userlist.allUser);
}

exports.isExist = (username) => {
  for(let u of userlist.allUser) {
    if (u == username)
      return true;
  }
  return false;
}

exports.deleteUser = (username) => {
  let index = userlist.allUser.indexOf(username)
  if(index != -1) {
    userlist.allUser.splice(index, 1);
    writeUserList();
  }
}


exports.getUserlist = () => {
  return userlist;
};