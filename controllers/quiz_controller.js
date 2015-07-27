var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz){
        req.quiz = quiz;
        next();
      }else{
        next(new Error('No existe quizId='+quizId));
      }
    }
  )
}

//GET /quizes
exports.index = function(req,res){
  if(req.query.search){
    var searchText = req.query.search;
    // Se susituyen los espacios por comodines
    searchText = searchText.replace(/ /g,'%');
    // Se ponen comodines por delante y por detrás del texto de búsqueda
    searchText = "%"+searchText+"%";
    models.Quiz.findAll({where: ["pregunta like ?", searchText]}).then(
      function(quizes){
        res.render('quizes/index.ejs', {quizes:quizes, filtered:true, errors:{}});
      }
    ).catch(function(error) {next(error);});
  }else{
    models.Quiz.findAll().then(
      function(quizes){
        res.render('quizes/index.ejs', {quizes:quizes, filtered:false, errors:{}});
      }
    ).catch(function(error) {next(error);});
  }
};

//GET /quizes/question
exports.show = function(req,res){
  res.render('quizes/show', {quiz: req.quiz, errors:{}});
};

//GET /quizes/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
    if(req.query.respuesta === req.quiz.respuesta){
      resultado = 'Correcto';
    }
      res.render('quizes/answer', {quiz: req.quiz, userRespuesta: req.query.respuesta, respuesta:req.quiz.respuesta, resultado:resultado, errors:{}})
};

// GET /quizes/new
exports.new = function(req,res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: ""}
  );
  res.render('quizes/new', {quiz: quiz, errors:{}})
};

// POST /quizes/create
exports.create = function(req,res){
  var quiz = models.Quiz.build(req.body.quiz);

  quiz.validate().then(
    function(err){
      if(err){
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      }else{
        //guarda en DB los campos pregunta y respuesta de quiz
        quiz.save({fields: ["pregunta","respuesta","tema"]}).then(function(){
          res.redirect('/quizes')})
      } // Redirección HTTP (URL relativo) lista de pregutnas
    }
  );
};

// GET /quizes/edit
exports.edit = function(req,res){
  var quiz = req.quiz;

  res.render('quizes/edit', {quiz: quiz, errors:{}});
};

// PUT /quizes/:id
exports.update = function(req,res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz.validate().then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }else{
        // save: guarda campos pregunta y respuesta en DB
        req.quiz.save({fields:["pregunta","respuesta","tema"]})
        .then(function(){ res.redirect('/quizes');});
        // Redirección HTTP a lista de preguntas (URL relativo)
      }
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req,res){
    req.quiz.destroy().then( function(){
      res.redirect('/quizes');
    }).catch(function(error){ next(error)})
};

//GET /author
exports.author = function(req, res){
  res.render('author.ejs', {errors:{}});
};
