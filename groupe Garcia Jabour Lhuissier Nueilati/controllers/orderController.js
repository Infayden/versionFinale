const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Article = mongoose.model('Article');

exports.checkoutOrder = (req, res) => {
    res.render('billingInformation');
};

exports.finishedOrder = async (req, res) => {
    const order = new Order({ // on crée une commande 
        user: req.user._id,
        cart: req.session.cart,
        address: req.body.address,
        name: req.body.name
    });
    await order.save(); // on enregistre la commande dans la base de données
    // puis on modifie le stock de chaque articles
    const keys = Object.keys(req.session.cart.items);
    for (let id of keys) {
        let article = await Article.findOne({
            _id: id
        });
        article.stock = article.stock - req.session.cart.items[id].qty;
        update = {
            stock: article.stock
        }
        const articleMaj = await Article.findOneAndUpdate({
            _id: id
        }, {
            $set: update
        }, {
            new: true,
            runValidators: true,
            context: 'query'
        });
    }
    req.session.cart = null; // on reinitiallise le panier 
    req.flash('success', 'Votre achat a bien été efféctué ');
    return res.redirect('/');
};
exports.validateOrder = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Vous devez remplir le champ nom!').notEmpty(); // on vérifie que le champs nom est bien remplis
    req.sanitizeBody('address');
    req.checkBody('address', 'Vous devez remplir le champ adresse!').notEmpty();
    req.sanitizeBody('prenom');
    req.checkBody('prenom', 'Vous devez remplir le champ prenom!').notEmpty();
    req.sanitizeBody('Ccn');
    req.checkBody('Ccn', 'Vous devez remplir le champ de la carte de crédit!').notEmpty();
    req.sanitizeBody('Ccv');
    req.checkBody('Ccv', 'Vous devez remplir le champ nom!').notEmpty();
    if (req.body.Ccn.length !== 16 && req.body.Ccv.length !== 3) { // on verifie la longueur des informations 
        return;
    }

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

exports.validateStock = async (req, res, next) => {
    const keys = Object.keys(req.session.cart.items);
    for (let id of keys) {
        let article = await Article.findOne({
            _id: id
        });
        if (req.session.cart.items[id].qty > article.stock) {
            req.flash('error', `Il n'y a pas assez de ${article.name} dans le stock il n'y a que ${article.stock} article en stock`)
        }
    }
}
// exports.sendOrder = (req,res, next )