
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var numUsers = 0;
var notice = '[공지사항] 경기 중에 채팅방 많이 이용해주세요.'

io.on('connection', function(socket){

  //console.log('one user connected ' + socket.id);
  io.to(socket.id).emit('notice', {SystemMessage : notice});

  socket.on('message', function(data){
    io.sockets.emit('message', {username: socket.username, message: data});
  });

  socket.on('disconnect',function(){
    console.log('one user disconnect ' + socket.id);
    --numUsers;
    io.sockets.emit('logout', {SystemMessage : ('[서버메세지] ' + socket.username + '님이 퇴장하셨습니다.\n' + '[서버메세지] 현재인원 '+ numUsers +'명')});
    console.log('User disconnected ' + socket.id + '  nickname : ' + socket.username );
  });

  socket.on('adduser',function(username){
    console.log('adduser');
    socket.username = username;
    ++numUsers;
    io.sockets.emit('logout', {SystemMessage : ('[서버메세지] ' + socket.username + '님이 입장하셨습니다.\n' + '[서버메세지] 현재인원 '+ numUsers +'명')});
    console.log('User connected ' + socket.id + '  nickname : ' + socket.username );
  });

});


http.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
