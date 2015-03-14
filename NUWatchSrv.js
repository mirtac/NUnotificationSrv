var WebSocketServer = require('websocket').server;
var http = require('http');

var request = require('request');
var util = require('util');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var app=express();

var userSave= {};
var connectionId=0;
var connections=[];
var onlineUsers = {};
var usePort = 3009;

/*var server = http.createServer(function(request, response) {
		    console.log((new Date()) + 'normal http request' + request.url);
		        response.writeHead(200);
		    //    response.write(util.inspect(request));
		        response.write(request.data);
		    //    response.write(util.inspect(url.parse(request.url,true).query));
		            response.end();
});*/
var server = http.createServer(app);
var userVerify= function(userInfo,connection,connId){
		/* just verify by yourself*/
		/* example: send request to check*/
		var options = {
			uri: 'http://www.cs.ccu.edu.tw/~cht99u/true.json',
			//method: 'POST',
			method: 'GET'
			//body: '',
	 		//headers: {
			//	 'content-type': 'text/plain',
	 		//}
		};
		request(options, function(error, response, body){
				var result ;
				console.log(body);
				result = JSON.parse(body);
				if(!result.verify){
						connection.close();
						return;
				}
						userId = recObj.uid
						onlineUsers[userId]={};
						onlineUsers[userId].uid=userId;
						connections[connId] = userId;
						if(!onlineUsers[userId].connections){
								onlineUsers[userId].connections=[];
								onlineUsers[userId].connections.push(connection);
						}else{
								onlineUsers[userId].connections.push(connection);
						}
						onlineUsers[userId].type="ws";
						/*TODO set other user info*/
						console.log("userOnline:  "+onlineUsers[recObj.uid].uid);//##test
		});

};
app.set('jsonp callback name');
app.use(bodyParser.json());
app.post('/notice/send/',function(request, response){
				var body = '';
				request.on('data', function (data) {
						body += data;

						if (body.length > 1e6){//prevent too big
								request.connection.destroy();
						}
						});
				request.on('end', function () {
						var noticeInfo;
						try{
								noticeInfo = JSON.parse(body);
						}
						catch(e){
								var str = "json parse fail,user is "+request.url;
								console.log(str);
								console.log(body);
								response.write(str);
								response.end(body);
								return;
						}
						/*TODO check send from our service*/
						response.writeHead(200);
						var str = "";
						var results = {send:0,success:[],fail:[]};
						//var tmpJson = {title:"xtitle",message:(new Date())+"",notificationNum:15};
						for(var i in noticeInfo.users){
								if(onlineUsers[ noticeInfo.users[i].uid ]){
										var tmpJson = {};
										if(! (noticeInfo.users[i].uid && noticeInfo.users[i].notificationNum )){
												results.fail.push(noticeInfo.users[i].uid);
												continue;
										}
										tmpJson.notificationNum = noticeInfo.users[i].notificationNum;
										if( noticeInfo.users[i].title ) {
												tmpJson.title = noticeInfo.users[i].title;
										}
										if( noticeInfo.users[i].message ) {
												tmpJson.message = noticeInfo.users[i].message;
										}
										
										if(onlineUsers[ noticeInfo.users[i].uid ] && onlineUsers[ noticeInfo.users[i].uid ].connections){
												for(var j in onlineUsers[ noticeInfo.users[i].uid ].connections){
														onlineUsers[ noticeInfo.users[i].uid ].connections[j].sendUTF(JSON.stringify(tmpJson));
														}
														//onlineUsers[ noticeInfo.users[i].uid ].connection.sendUTF(JSON.stringify(tmpJson));//TODO adjust to good format
										}
										
										results.send++;
										results.success.push(noticeInfo.users[i].uid);
										
										console.log((new Date()) + 'ws notice send, get from: ' + request.connection.remoteAddress + "[user]:"+noticeInfo.users[i].uid);
										str += "[" + JSON.stringify(noticeInfo.users[i]) + "]\n";
								}else{
										results.fail.push(noticeInfo.users[i].uid);
								}

						}
						//onlineUsers[noticeInfo.uid] = ;//jsonData;
						//response.write(util.inspect(url.parse(request.url,true).query));
						response.write(JSON.stringify( results ));
						response.end();
				});
});
app.get('/users/getAll/',function(request, response){
				var body = '';
				request.on('data', function (data) {
						body += data;

						if (body.length > 1e6){//prevent too big
								request.connection.destroy();
						}
						});
				request.on('end', function () {
						var noticeInfo;
						/*try{
								noticeInfo = JSON.parse(body);
						}
						catch(e){
								var str = "json parse fail,user is "+request.url;
								console.log(str);
								console.log(body);
								response.write(str);
								response.end(body);
								return;
						}*/
						/*TODO check send from our service*/
						response.writeHead(200);
						var tmpJson = {};
						tmpJson.users = [];
						var str = "";
						for(var i in onlineUsers){
								if(onlineUsers[i]){
										tmpJson.users.push(onlineUsers[ i ].uid);
								}
						}
						//onlineUsers[noticeInfo.uid] = ;//jsonData;
						//response.write(util.inspect(url.parse(request.url,true).query));
						console.log((new Date()) + 'request for get all users id' + request.url);
						response.write( JSON.stringify( tmpJson ) );
						response.end();
				});
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



				try{
						var connection = request.accept('notify', request.origin);
				}catch(e){
						console.log("connection fail");
						return;
				}

				var connId=++connectionId;
				
				//
				console.log((new Date()) + 'connect accept,orgin is :' + connection.remoteAddress);

				/* ... */
				connection.on('message', function(message) {
						if (message.type == 'utf8') {
						//console.log((new Date()) + 'get text: ' + message.utf8Data);
						try{//test
						recObj = JSON.parse(message.utf8Data);
						console.log((new Date()) + 'JSON-get : ' + message.utf8Data);

						}catch(e){
						console.log((new Date()) + 'NOTJSON-get text: ' + message.utf8Data);
						}
						try{
								userVerify(recObj,connection,connId); //TODO open it!
						}catch(e){
								console.log('userVerify error' + JSON.stringify(e));
								connection.close();
								return;
						}
								/*testing*/
						var tmpJson = {title:"["+recObj.uid+"]xtitle",message:(new Date())+"",notificationNum:15};
						connection.sendUTF(JSON.stringify(tmpJson));
								/*testing end*/


						/*handle text which received*/
						}
						});
				connection.on('close', function(reasonCode, description) {
						    console.log((new Date()) + 'connect close[' + connections[connId]+"]");

						    if(onlineUsers[connections[connId]] && onlineUsers[connections[connId]].connections && onlineUsers[connections[connId]].connections.length==0){
						    		onlineUsers[connections[connId]] = null;
							}else if(onlineUsers[connections[connId]]){
									var connectionIndex = onlineUsers[connections[connId]].connections.indexOf(connection);
									onlineUsers[connections[connId]].connections.splice(connectionIndex, 1);
							}
							connections.splice(connId,1);

						        /*other close work*/ 
				});
				});
