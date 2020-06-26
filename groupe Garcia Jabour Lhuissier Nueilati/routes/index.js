const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const articleController = require('../controllers/articleController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');
const Cart = require('../models/Cart');
const {
    catchErrors
} = require('../handlers/errorHandlers');
const Article = require('../models/Article');
const {
    reduceByOne
} = require('../controllers/cartController');

router.get('/', articleController.getArticleHomePage);
router.get('/inscription', userController.registerForm);
router.get('/PS4', catchErrors(articleController.getArticlePS4));
router.get('/PS4/page/:page', catchErrors(articleController.getArticlePS4));
router.get('/XBoxOne', catchErrors(articleController.getArticleXBoxOne));
router.get('/XBoxOne/page/:page', catchErrors(articleController.getArticleXBoxOne));
router.get('/Nintendo', catchErrors(articleController.getArticleSwitch));
router.get('/Nintendo/page/:page', catchErrors(articleController.getArticleSwitch));
router.get('/inde', catchErrors(articleController.getArticleinde));
router.get('/inde/page/:page', catchErrors(articleController.getArticleinde));
router.get('/coeur', catchErrors(articleController.getArticlesCoupDeCoeur));
router.get('/coeur/page/:page', catchErrors(articleController.getArticlesCoupDeCoeur));
router.post('/inscription', userController.validateRegister, catchErrors(userController.register), authController.login);
router.get('/connexion', userController.loginForm);
router.post('/connexion', authController.login);
router.get('/deconnexion', authController.deconnexion);
router.get('/profile', authController.isLoggedIn, userController.profile);
router.post('/profile', catchErrors(userController.updateBillingInformation));
router.get('/forgot', authController.forgotPassword);
router.post('/forgot', catchErrors(authController.forgot));
router.get('/profile/reset/:token', catchErrors(authController.reset));
router.post('/profile/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));
router.get('/article/:slug', catchErrors(reviewController.showReviews));
router.get('/cart/orderCheckout', authController.isLoggedIn, orderController.checkoutOrder);
router.post('/cart/orderCheckout', orderController.validateOrder, catchErrors(orderController.validateStock), catchErrors(orderController.finishedOrder));
router.get('/coeur', catchErrors(articleController.getArticlesCoupDeCoeur));
router.get('/api/search', catchErrors(articleController.searchArticles));
router.get('/historique', authController.isLoggedIn, userController.getPurchaseHistory);
router.get('/mesCommentaires', catchErrors(reviewController.showMyReviews));
router.get('/ajouterAuPanier/:id', authController.isLoggedIn, cartController.addToCart);
router.get('/reduire/:id', authController.isLoggedIn, cartController.reduceByOne);
router.get('/retirer/:id', authController.isLoggedIn, cartController.deleteItem);
router.get('/panier', authController.isLoggedIn, cartController.showCart)


module.exports = router;