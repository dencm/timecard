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
				 console.log("save json fail:"+err);

				 res.writeHead(500, {
				 	'Content-Type': 'text/html',
					'Access-Control-Allow-Origin': '*'
				})
			
			 	res.write("save json fail:"+err);
			  } else {
			  	 console.log(JSON.stringify(post) +" save to json");
				 res.writeHead(200, {
					 'Content-Type': 'text/html',
					 'Access-Control-Allow-Origin': '*'
					 });	
				
				 res.write("success");
			  }
			  res.end();
			});
	    });
   } else if(pathname == "/read"){
	   fs.readFile("items.json", function (err, data) {
		  if (err) {
			 console.log("read json fail:"+err);

			 res.writeHead(500, {
			 	'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': '*'
			 });
			
			 res.write("read json fail:"+err);
		  }else{
			 res.writeHead(200, {
				 'Content-Type': 'text/html',
				 'Access-Control-Allow-Origin': '*'
				 });
			
			 res.write(JSON.stringify(JSON.parse(data)));
		  }
		  
		  res.end();
	   })
   } else{
	   	res.writeHead(400, {
		 	'Content-Type': 'text/html',
			'Access-Control-Allow-Origin': '*'
		 });
		res.end();
   }
}).listen(process.env.PORT || 3000);


console.log('Server running');