var path = require('path');

// Cargar el Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,
                  {dialect: "sqlite", storage: "quiz.squilite"}
                );

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz.js'));

exports.Quiz = Quiz; // exportar definicion de la tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function () {
  //then(...) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count) {
    if(count === 0) {
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                  })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
