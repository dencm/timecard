var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var util = require('util');

http.createServer(function(req, res){
   
   var pathname = url.parse(req.url).pathname;
   //console.log("Request for " + pathname + " received.");
   
   if(pathname == "/write"){
	    var post = '';  

	    req.on('data', function(chunk){   
	        post += chunk;
	    });

	    req.on('end', function(){   

			var content = JSON.parse(fs.readFileSync('items.json', 'utf8'));
	        post = JSON.parse(post);
			content.data.push(post);

			// save file
			fs.writeFile("items.json", JSON.stringify(content), function (err) {
			  if (err) {
			  	 response(res, "save json fail:"+err, 500, "save json fail:"+err);
			  } else {
			  	 response(res, JSON.stringify(post) +" save to json", 200, "success");
			  }
			});
	    });
   } else if(pathname == "/read"){
	   fs.readFile("items.json", function (err, data) {
		  if (err) {
			 response(res, "read json fail:"+err, 500, "read json fail:"+err);
		  }else{
			 response(res, null, 200, JSON.stringify(JSON.parse(data)));
		  }
	   })
   } else{
		response(res, null, 400, null);
   }
}).listen(process.env.PORT || 3000);


function response(res, message, code, body){

	if(message){
	 	console.log(message);
	}

	 res.writeHead(code, {
	 	'Content-Type': 'text/html',
		'Access-Control-Allow-Origin': '*'
	});

	if(body){
 		res.write(body);
	}
	res.end();
}


console.log('Server running');