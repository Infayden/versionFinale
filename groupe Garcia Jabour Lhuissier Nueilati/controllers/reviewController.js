const mongoose = require('mongoose');
const Review = mongoose.model('Review'); // on definit review comme étant notre model 
const Article = mongoose.model('Article');
const User = mongoose.model('User');


exports.addReview = async (req, res) => {
    req.body.authorId = req.user._id; // on recupère l'id de l'utilisateur qui poste le commentaire
    req.body.article = req.params.id
    req.body.authorName = req.user.name; // on recupère l'id de l'article sur lequel est écrit le commentaire
    const newReview = new Review(req.body); // on crée un commentaire grâce a notre model 
    await newReview.save(); //on enregistre ce commentaire dans la base de données
    req.flash('sucess', 'Merci pour le commentaire!');
    res.redirect('back');
};

exports.showReviews = async (req, res) => {
    const article = await Article.findOne({ // on recupère l'article sur lequel on se trouve 
        slug: `/${req.params.slug}`
    });
    const reviews = await Review.find({ // on récupère les reviews de l'article 
        article: article._id
    });
    res.render('game', {
        article,
        reviews
    });

}
exports.showMyReviews = async (req, res) => {
    const myReviews = Review.find({
        authorId: req.user._id
    });
    res.render('myReviews', {
        myReviews
    })
}