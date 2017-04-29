var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
var Poke = require('../database-mongo/index.js');
var request = require('request');
// var Promise = require('bluebird');

var app = express();

// UNCOMMENT FOR REACT

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
     // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});
app.use(express.static(__dirname + '/../react-client/dist'));

app.use(bodyParser.json());

app.get('/pokesearch', function (req, res) {
  // console.log('hi')
  // console.log(req.query.query)
	var pokemonDataObj = {}
  request('http://pokeapi.co/api/v2/pokemon/' + req.query.query + '/', function(err, response, data) {
    // if (err) {
    //   pokemonDataObj.name = 'MissingNo.'
    //   pokemonDataObj.type = ['Bird', 'Normal']
    //   pokemonDataObj.spiriteURL = 'https://vignette1.wikia.nocookie.net/nintendo/images/8/85/MissingNoNormal.png/revision/latest?cb=20131114211037&path-prefix=en'
    //   res.send(pokemonDataObj);
    //   res.end()
    // } else {
    	var pokemonData = JSON.parse(data);
    	var typeArray = [];
    	pokemonData.types.map(types => {
        typeArray.push(types.type.name)
    	})
    	pokemonDataObj = {
    	  name: pokemonData.forms[0].name,
    	  type: typeArray,
    	  spriteURL: pokemonData.sprites.front_default
    	}
    	//store searched pokemon!
    	res.send(pokemonDataObj);
      res.end()
    // }
  })
  // Poke.selectAll(function(err, data) {
  //   if(err) {
  //     console.log('meow :<')
  //     res.sendStatus(500);
  //   } else {
  //     console.log('get received!')	
  //     res.json(data);
  //   }
  // });
  // res.json(pokemonDataObj)
  // console.log('outside', pokemonDataObj)
});


app.listen(3000, function() {
  console.log('listening on port 3000!');
});

