// on initialise les constantes dont on aura besoin 
const passport = require('passport'); // passport est un package permettant de gérer l'autentification des utilisateurs 
const crypto = require('crypto'); // crypto est une fonction de node permettant de crée une chaine de caractère pseudo aléatoire
const mongoose = require('mongoose'); // mongoose est notre connection a notre base de données
const User = mongoose.model('User'); // on importe notre modèle utilisateur afin de pouvoir l'utiliser dans nos fonction
const promisify = require('es6-promisify'); // on utilise la fonction de node promisify qui permet de transformer une requête en promesse
const mail = require('../handlers/mail') // on recupère notre handler mail qui nous permettra d'envoyer un mail pour la reinitialisation du mot de passe 

exports.login = passport.authenticate('local', { // on utilise la stratégie 'local' de passport  
  successRedirect: '/', // Si l'utilisateur est bien authentifié, on le renvoie a la page d'acceuil
  successFlash: 'Vous êtes désormais connecté !',
  failureRedirect: '/connexion', // Sinon on le renvoie au formulaire de connexion
  failureFlash: 'Votre mot de passe ou votre E-mail est erronés !',
});

exports.deconnexion = async (req, res) => {
  await req.logout(); //On utilise la fonction de passport permettant de déconnecter un utilisateur
  req.flash('success', 'Vous êtes bien déconnecté');
  //req.session.destroy();
  return res.redirect('/'); // on redirige l'utilisateur vers la page d'accueil
};

exports.isLoggedIn = (req, res, next) => {
  // on verifie si l'utilisateur est bien connecté
  if (req.isAuthenticated()) { // on utilise la fonction de passport 'is authentificated'
    next(); //si il est bien connecté on passe au prochain middleware
    return;
  }
  req.flash('error', 'Vous devez être connecté pour faire ça !');
  return res.redirect('/connexion');
};


exports.forgotPassword = (req, res) => {
  res.render('forgot');
};
exports.forgot = async (req, res) => {
  // on verifie que l'utilisateur existe
  const user = await User.findOne({
    email: req.body.email
  }); //on utilise async await pour attendre la reponse associée a la requete
  if (!user) {
    req.flash('success', `Un E-mail à été envoyé a l'adresse ${req.body.email}
      `); // on envoie le même message que l'adresse entrée soit bonne ou pas cela evite qu'un utilisateur avec un grand nombre d'email puisse savoir qui est inscrit sur notre site
    return res.redirect('/forgot');
  };
  //on cree un token 
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex'); // on crée un token avec la fonction crypto, celui là servira de lien pour la reinitialisation du mot de passe
  user.resetPasswordExpires = Date.now() + 3600000; // on met une limite de temps au token de 1h
  await user.save(); //on enregistre ces token dans la base de données
  const resetURL = `http://${req.headers.host}/profile/reset/${user.resetPasswordToken}`;
  //puis on envoie un E-mail avec le token 
  await mail.send({ // on envoie un email a l'utilisateur cela est simuler grâce a mail trap 
    user,
    filename: 'password-reset',
    subject: 'Reinitialisation du mot de passe',
    resetURL
  });
  req.flash('success', `Un E-mail à été envoyé a l'adresse suivante ${req.body.email}`);
  // on renvoie l'utilisateur vers la page d'oublie 
  return res.redirect('/forgot');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    } // on verifie que le token est bien encore valable et qu'il existe bel et bien 
  });
  if (!user) {
    req.flash('error', 'Le lien est invalide ou a expiré.')
    return res.redirect('/login'); // si il ne l'est pas l'utilisateur est renvoyé vers la page de connexion

  }
  res.render('reset'); // Sinon on lui montre la page de reinitialisation du mot de passe 
};
exports.confirmedPasswords = (req, res, next) => { // il s'agit d'un middleware qui verifie que les deux mots de passes sont egaux 
  if (req.body.password === req.body['password-confirm'] && req.body.password.length) {
    next()
    return;
  }
  req.flash('error', 'les mots de passe de correspondent pas ou ne peuvent pas être vide');
};
exports.update = async (req, res) => { // cette fonction a pour but de mettre a jour le nouveau mot de passe 
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now() // on verifie si le token est toujours valide au cas ou l'utilisateur laisse son pc sur la page
    }
  });
  if (!user) {
    req.flash('error', 'Le lien est invalide ou a expiré.');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password); // on applique le changement de mot de passe 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined; // on remet les token en undefined 
  const updatedUser = await user.save(); // on sauvegarde notre utilisateur dans la base de donnés 
  await req.login(updatedUser); //on connecte l'utilisateur après le changement de mot de passe 
  req.flash('success', 'Votre mot de passe à été réinitialisé !');
  return res.redirect('/');
};