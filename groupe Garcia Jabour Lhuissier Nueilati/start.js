const mongoose = require('mongoose');

// on importe notre fichier environnement qui nous permettra de garder nos données sensibles
require('dotenv').config({
  path: 'variables.env'
});

// on se connecte à notre base de données et on gère les erreurs 
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // on utilise les promesses avec mongoose
mongoose.connection.on('error', (err) => {
  console.error(`${err.message}`);
});


//on importe les models
require('./models/Article');
require('./models/Review');
require('./models/User');
require('./models/Order')
// on lance notre application
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  (`Express running → PORT ${server.address().port}`);
});

require('./handlers/passport')
require('./handlers/mail');
// de nombreuses fonctionalité ne sont pas présentes car en cours de developpement 