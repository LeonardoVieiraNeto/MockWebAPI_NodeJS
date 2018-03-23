var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' })
var mongo = require('mongodb');
var db = require('monk')('localhost/mockApiNode');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/mockApiNode/";

router.get('/show/:id', function(req, res, next) {

	var alunos = db.get('alunos');

	alunos.findById(req.params.id,function(err, aluno){
		res.render('show',{
  			'aluno': aluno
  		});
	});
});

router.get('/delete/:id', function(req, res, next) {

	var request=require("request");

	request.del('http://5aa957004cf36300144e962c.mockapi.io/api/v1/alunos/' + req.params.id, function(error,response,body){
		if(error){
			req.flash('Aconteceu algo de errado ao excluir o aluno!');
			console.log(error);
		}
		else
		{
			//EXIBI A MENSAGEM DE EXCLUSÃO E RECARREGAR A TELA. 
			req.flash('success', 'Aluno excluído com sucesso!');
			res.redirect('/alunos/listaAluno');
		}
	});	
});

router.get('/adicionarAluno', function(req, res, next) {
	res.render('adicionarAluno',{ });
});

router.post('/adicionar', upload.single('mainimage'), function(req, res, next) {

  // Get Form Values
  var nome = req.body.nome;
  var logradouro= req.body.logradouro;
  var numero = req.body.numero;
  var bairro = req.body.bairro;
  var cidade = req.body.cidade;
  var estado = req.body.estado;

  // Válida os campos obrigatórios
  req.checkBody('nome','Campo nome é obrigatório.').notEmpty();
  req.checkBody('logradouro', 'Campo logradouro é obrigatório.').notEmpty();
  req.checkBody('numero', 'Campo número é obrigatório.').notEmpty();
  req.checkBody('bairro', 'Campo Bairro é obrigatório.').notEmpty();
  req.checkBody('cidade', 'Campo Cidade é obrigatório.').notEmpty();
  req.checkBody('estado', 'Campo Estado é obrigatório.').notEmpty();

  var errors = req.validationErrors();

  if(errors)
  {
	res.render('adicionarAluno',{
		"errors": errors
	});
  } 
  else
  {
  	var request=require("request");

  	console.log('Dentro do salvar 1');

	var data = '{ "Nome": "Nome inserido pela Tela", "Logradouro": "Logradouro inserido pela Tela", "Numero": "763", "Bairro": "Bairro inserido pela Tela", "Cidade": "Cidade inserido pela Tela", "Estado": "Estado inserido pela Tela" }';

    console.log(data);

    var json_obj = JSON.parse(data);
   
    console.log(json_obj);

    request.post({
        headers: {'content-type':'application/json'},
        url:'http://5aa957004cf36300144e962c.mockapi.io/api/v1/alunos/',
        form:    json_obj
    },function(error, response, body){
    
    	if(error){
			req.flash('Aconteceu algo de errado ao excluir o aluno!');
			console.log(error);
		}
		else
		{
			console.log('Dentro do post 3');

			//EXIBI A MENSAGEM DE EXCLUSÃO E RECARREGAR A TELA. 
			req.flash('success', 'Aluno salvo com sucesso!');
			res.redirect('/alunos/listaAluno');

			console.log('Salvou certinho');
		}

  });


 //  	request.post('http://5aa957004cf36300144e962c.mockapi.io/api/v1/alunos/' + req.params.id, function(error,response,body){
		
 //  		console.log('Dentro do post 2');

	// 	if(error){
	// 		req.flash('Aconteceu algo de errado ao excluir o aluno!');
	// 		console.log(error);
	// 	}
	// 	else
	// 	{
	// 		console.log('Dentro do post 3');

	// 		//EXIBI A MENSAGEM DE EXCLUSÃO E RECARREGAR A TELA. 
	// 		req.flash('success', 'Aluno salvo com sucesso!');
	// 		res.redirect('/alunos/listaAluno');

	// 		console.log('Salvou certinho');
	// 	}
	// });	
  }
});

router.get('/listaAluno', function(req, res, next) {

// get walking directions from central park to the empire state building
var http = require("http");

http.get('http://5aa957004cf36300144e962c.mockapi.io/api/v1/alunos', (res2) => {
  const { statusCode } = res2;
  const contentType = res2.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    //res.resume();
    return;
  }

  res2.setEncoding('utf8');
  let rawData = '';
  res2.on('data', (chunk) => { rawData += chunk; });
  res2.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
     
      res.render('listaAluno',{
  			'alunos': parsedData
  		});

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

});

module.exports = router;