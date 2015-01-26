var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

console.log("connected");

mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
	
	var col = db.collection('messages');
	client.on('connection', function(socket){
	console.log('Someone has connected.');
	
	socket.on('input',function(data){
		var name = data.name;
		var message = data.message;
		console.log(data);
		
	col.insert({name:name,message:message},function(){
		console.log('inserted');
		client.emit('output',[data]);
	});
	
	});
	
	
	col.find().limit(10).sort({_id:1}).toArray(function(err,res){
		if(err) throw err;
		console.log(res);
		socket.emit('output',res);
	});
	
});

});
