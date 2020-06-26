const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Article = mongoose.model('Article');


exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    const article = await Article.findById(productId, function (err, article) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(article, article.id);
        req.session.cart = cart;
        return res.redirect('back');
    });
};

exports.reduceByOne = (req, res, next) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    return res.redirect('/panier');
};

exports.deleteItem = (req, res, next) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    return res.redirect('/panier');
};
exports.showCart = (req, res, next) => {
    if (!req.session.cart) {
        res.render('shoppingCart', {
            product: null
        });
    }
    let cart = new Cart(req.session.cart);
    res.render('shoppingCart', {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice
    })
};