var WebSocketServer = require('websocket').server;
var http = require('http');

var util = require('util');
var url = require('url');

var userId= {};


var usePort = 5566;
var server = http.createServer(function(request, response) {
		    console.log((new Date()) + 'normal http request' + request.url);
		        response.writeHead(404);
		    //    response.write(util.inspect(request));
		        response.write(util.inspect(url.parse(request.url,true).query));
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
				
				
				
				var tmpJson = {title:"xtitle",message:(new Date())+"",notificationNum:15};
				connection.sendUTF(JSON.stringify(tmpJson));
				console.log((new Date()) + 'connect accept,orgin is :' + request.origin);
				//setTimeout(function (){connection.close()},5000);

				/* ... */
				connection.on('message', function(message) {
						if (message.type == 'utf8') {
						//console.log((new Date()) + 'get text: ' + message.utf8Data);
						try{//test
								console.log(message.utf8Data.apple);
						}catch(e){}
						try{//test
						recObj = JSON.parse(message.utf8Data);
						console.log((new Date()) + 'JSON-get : ' + message.utf8Data);
						//TODO auth for user
						//test auth//
						//userId[]=connection;
						//test//

						}catch(e){
						console.log((new Date()) + 'NOTJSON-get text: ' + message.utf8Data);
						}
						/*handle text which received*/
						}
						});
				connection.on('close', function(reasonCode, description) {
						    console.log((new Date()) + 'connect close');
						        /*other close work*/ 
				});
				});
