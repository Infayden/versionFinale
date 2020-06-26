const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({ // on initialise notre schema
    created: {
        type: Date,
        default: Date.now, // Date.now permet de récuperer la date au moment ou le commentaire est posté 
    },
    authorId: {
        type: mongoose.Schema.ObjectId, // l'id sera celui de l'auteur du commentaire
        ref: 'User', // on crée une relation avec la collection des utilisateurs
    },
    authorName: {
        type: String,

    },
    article: {
        type: mongoose.Schema.ObjectId, // l'id sera l'id de l'article sur lequel le commentaire sera posté
        ref: 'Article', // on crée une relation avec la collection des articles
    },
    text: {
        type: String,
        required: 'Your review must have text!',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    }
});

module.exports = mongoose.model('Review', reviewSchema); // on exporte le Schema