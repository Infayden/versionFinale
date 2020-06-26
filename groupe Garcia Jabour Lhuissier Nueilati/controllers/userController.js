const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const Order = mongoose.model('Order');

exports.loginForm = (req, res) => {
  res.render('connexion'); // on affiche le formulaire de connexion
};

exports.registerForm = (req, res) => {
  res.render('inscription'); // on affiche le formulaire d'inscription
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Vous devez remplir le champ nom!').notEmpty(); // on vérifie que le champs nom est bien remplis
  req.checkBody('email', `Votre E-mail n'est pas valide`).isEmail(); // on verifie que l'email est normale
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Le mot de passe ne peut pas être vide!').notEmpty(); //on vérifie que le champs nom est bien remplis
  req.checkBody('password-confirm', 'Le mot de passe de confirmation ne peut pas être vide!').notEmpty(); //on vérifie que le champs nom est bien remplis
  req.checkBody('password-confirm', 'Vos mots de passe ne correspondent pas ').equals(req.body.password); //on vérifie que les deux mots de passes sont bien différents

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map((err) => err.msg));
    res.render('inscription', {
      body: req.body,
      flashes: req.flash()
    }); //si il y a des erreurs l'utilisateur est renvoyé sur la page d'inscription avec des messages d'érreur
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name
  });
  const register = promisify(User.register, User); // on transforme notre requête en promesse afin d'utiliser async await
  await register(user, req.body.password); // on enregistre le hash du mot de passe a part afin d'éviter les failles de sécurité
  next();
};

exports.profile = (req, res) => {
  res.render('profile');
};

exports.updateBillingInformation = async (req, res) => {
  // cette fonction n'est pas encore utilisée mais elle le sera lorque le profil sera implémenté
  const updates = {
    // on recupere les données a mettre a jour
    name: req.body.name,
    firstName: req.body.firstName,
    address: req.body.address
  };
  const user = await User.findOneAndUpdate({
    // on récupère  un utilisateur grace à son id
    _id: req.user._id
  }, {
    $set: updates //on met a jour les données que l'utilisateur à rentré
  }, {
    new: true,
    runValidators: true,
    context: 'query'
  });
  req.flash('success', 'Profil mis à jour !');
  return res.redirect('back');
};
exports.getPurchaseHistory = async (req, res) => {
  let skip;
  const count = await Order.count({ // on compte le nombre de commandes que l'utilisateurs a dans le but de n'afficher que les 5 dernières 
    user: req.user._id
  });
  if (count >= 10) {
    skip = count - 5;
  } else if (5 < count < 10) {
    skip = count - count % 5;
  } else if (count <= 5) {
    skip = 0;
  }
  const userOrders = await Order.find({
      user: req.user._id
    })
    .limit(5)
    .skip(skip);
  res.render('historique', {
    userOrders
  });
};