var WebSocketServer = require('websocket').server;
var http = require('http');

var util = require('util');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var app=express();

var userSave= {};
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
										onlineUsers[ noticeInfo.users[i].uid ].connection.sendUTF(JSON.stringify(tmpJson));//TODO adjust to good format
										
										results.send++;
										results.success.push(noticeInfo.users[i].uid);
										
										console.log((new Date()) + 'ws notice send, get from: ' + request.url+"[user]:"+noticeInfo.users[i].uid);
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
app.post('/tabs/save/',function(request, response){
				var body = '';
				request.on('data', function (data) {
						body += data;

						if (body.length > 1e6){//prevent too big
								request.connection.destroy();
						}
						});
				request.on('end', function () {
						var jsonData;
						try{
								jsonData = JSON.parse(body);
						}
						catch(e){
								console.log("json parse fail,user is "+request.url);
						}
						//console.log("??"+body+"!!");return;
						/*for(var i=0;i<jsonData.urls.length;i++){
								if(jsonData.urls){
										try{
												console.log(jsonData.urls[i].title);
										}catch(e){
												console.log("wrong at save loop:"+i);
										console.log(JSON.stringify(body));
												break;
										}
								}
								else{
										console.log(JSON.stringify(body));
								}
						}*/
						userSave[jsonData.userIdentify] = jsonData;
				console.log((new Date()) + 'normal save request' + request.url+"[user]:"+jsonData.userIdentify);
				response.writeHead(200);
				response.write(jsonData.userIdentify+" save success!");
				//response.write(util.inspect(url.parse(request.url,true).query));
				response.end();
				});
});
app.get('/tabs/get/',function(request, response){
				queryData=url.parse(request.url,true).query;
				var body = '';
				request.on('data', function (data) {
						body += data;
						if (body.length > 1e6){//prevent too big
								request.connection.destroy();
						}
						});
				request.on('end', function () {
						});
				console.log((new Date()) + 'normal get request' + request.url+"[user]:"+queryData.uid);
				if(userSave.hasOwnProperty(queryData.uid)){
						/*response.write(queryData.uid+"get:");
						for(var i=0;i<userSave[queryData.uid].urls.length;i++){
								response.write(userSave[queryData.uid].urls[i].title+"@@@");
								response.write(userSave[queryData.uid].urls[i].url+"<br/>");
								response.write("\nlo::"+userSave[queryData.uid].urls[i].scrollLocation+"\n");
						}*/
						//response.setHeader('Content-Type', 'application/json');
						//response.writeHead(200);
						//response.write(JSON.stringify(userSave[queryData.uid]));
						response.jsonp(userSave[queryData.uid]);
						
				}else{
						response.writeHead(200);
						response.write("no user:"+queryData.uid);
				}
				//response.write(util.inspect());
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



				try{
						var connection = request.accept('notify', request.origin);
				}catch(e){return;}

				var userId=undefined;
				
				
				//TODO put to send message

				//
				console.log((new Date()) + 'connect accept,orgin is :' + request.origin);
				//setTimeout(function (){connection.close()},5000);

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
						if(recObj.type && recObj.type == "verify"){
								/*testing*/
								var tmpJson = {title:"["+recObj.uid+"]xtitle",message:(new Date())+"",notificationNum:15};
								connection.sendUTF(JSON.stringify(tmpJson));
								/*testing end*/
								/*TODO auth for user and check json format*/
								userId = recObj.uid
								onlineUsers[userId]={};
								onlineUsers[userId].uid=userId;
								onlineUsers[userId].connection=connection;
								onlineUsers[userId].type="ws";
								/*TODO set other user info*/
								console.log("userOnline:  "+onlineUsers[recObj.uid].uid);//##test


						}
						/*handle text which received*/
						}
						});
				connection.on('close', function(reasonCode, description) {
						    console.log((new Date()) + 'connect close[' + userId+"]");
						    onlineUsers[userId] = null;

						        /*other close work*/ 
				});
				});
