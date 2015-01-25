var WebSocketServer = require('websocket').server;
var http = require('http');
var usePort = 5566;
var server = http.createServer(function(request, response) {
		    console.log((new Date()) + 'normal http request' + request.url);
		        response.writeHead(404);
		            response.end();
});
server.listen(usePort, function() {
		    console.log((new Date()) + 'run on port:' + usePort);
});

wsServer = new WebSocketServer({
		    httpServer: server,
		        autoAcceptConnections: false
});
wsServer.on('request', function(request) {
				/*if (!verifyRequest(request)) {
				request.reject();   
				console.log((new Date()) + 'reject connect,orgin is :' + request.origin);
				return;
				}*/

				var connection = request.accept('test', request.origin);
				var tmpJson = {title:"xtitle",message:"testMessage",notificationNum:15};
				connection.sendUTF(JSON.stringify(tmpJson));
				console.log((new Date()) + 'connect accept,orgin is :' + request.origin);
				setTimeout(function (){connection.close()},5000);

				/* ... */
				connection.on('message', function(message) {
						if (message.type == 'utf8') {
						console.log((new Date()) + 'get text: ' + message.utf8Data);
						/*handle text which received*/
						}
						});
				connection.on('close', function(reasonCode, description) {
						    console.log((new Date()) + 'connect close');
						        /*other close work*/ 
				});
				});
