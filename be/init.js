let socketServer = require('socket.io')();
socketServer.on('connection', function(socket) {
	socket.on('user_connect', (data) => {
		socket.username = data;
        let message = formatMessage(data, 'User connected: '+data);
        socket.emit('receive_message', message);
        socket.broadcast.emit('receive_message', message);
	});
	
	socket.on('send_message', (data) => {
	    let message = formatMessage(socket.username, data);
        socket.emit('receive_message', message);
        socket.broadcast.emit('receive_message', message);
	});

    socket.on('user_disconnect', () => {
        let message = formatMessage(socket.username, "User disconnected: "+socket.username);
        socket.broadcast.emit('receive_message', message);
        socket.username = undefined;
    });

	socket.on('disconnect', function() {
	    if(socket.username) {
            let message = formatMessage(socket.username, "User disconnected: "+socket.username);
            socket.broadcast.emit('receive_message', message);
        }
	});

	function formatMessage(username, data) {
        return {
            username: username,
            message: data,
            timestamp: (new Date()).getTime()
        };
    }
});
socketServer.listen(3010);

return socketServer;