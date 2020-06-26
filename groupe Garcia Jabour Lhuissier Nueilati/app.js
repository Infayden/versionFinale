// on importe nos packages nécessaires au bon fonctionnement de notre site 
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes/index');
const app = express();


app.set('views', path.join(__dirname, 'views')); // ceci est le dossier dans lequel se trouve notre view
app.set('view engine', 'pug'); // on utilise pug pour génerer nos views

// permet de ne pas avoir a preciser le /public lors de l'appel d'un fichier se trouvant à l'intérieur
app.use(express.static(path.join(__dirname, 'public')));


// permet d'utiliser les requetes comme proprietés du body on peut les récupérer via req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// nous permet d'utiliser des fonctions d'express lié a la validation
app.use(expressValidator());

// permet de manipuler les cookies depuis une requête
// app.use(cookieParser());

// les sessions permettent de garder les données d'un visiteur entre les requêtes
// cela permet aussi de garder les utilisateur connectés et de leur envoyer des flash 
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

// on utilise passport pour gérer nos connections
app.use(passport.initialize());
app.use(passport.session());

// le middleware flash permet d'envoyer des messages d'erreur
app.use(flash());

// permet de rendre ces variables disponible à notre view
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  res.locals.session = req.session;
  next();
});


// nous permet de faire des promesses a partir de fonction à 
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// 
app.use('/', routes);

// si la route n'est pas trouvée on renvoie une page d'erreur 
app.use(errorHandlers.notFound);

// notre error handler qui verifira si ce sont seulement des erreurs de validations
app.use(errorHandlers.flashValidationErrors);

//si c'est une erreur qui n'est pas prevu on entre dans ce if
if (app.get('env') === 'development') {
  /*on montre ces erreur seulement lors du developpement  */
  app.use(errorHandlers.developmentErrors);
}

// 
app.use(errorHandlers.productionErrors);

// on exporte desormais le tout pour pouvoir l'utiliser dans le start 
module.exports = app;