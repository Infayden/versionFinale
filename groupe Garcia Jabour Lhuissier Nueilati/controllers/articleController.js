const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Article = mongoose.model('Article');
const maxPerPage = 20;


exports.getArticleSwitch = async (req, res) => {
  //on récupère les article d'une certaine console afin de l'afficher dans sa page 
  // on recupère le nombre d'élément que l'on va devoir passer dans la base de données pour la page suivante
  const pageName = "Nintendo";
  const page = req.params.page || 1
  const skip = (page - 1) * maxPerPage;
  const articlesSwitch = Article.find({
      console: "Nintendo Switch"
    })
    .skip(skip) // au évite les articles déja affichés auparavant 
    .limit(maxPerPage); // on limite a 20 par pages

  const articlesSwitchCount = Article.count({
    console: "Nintendo Switch"
  }) // on compte le nombre d'articles
  const [articles, count] = await Promise.all([articlesSwitch, articlesSwitchCount]); // on utilise await pour attendre le résultats de nos requetes 
  const pages = Math.ceil(count / maxPerPage); // on calcules le nombre de pages que l'on aura a afficher 
  res.render('articlesAccueil', {
    articles,
    count,
    page,
    pages,
    pageName
  });
};


exports.getArticlePS4 = async (req, res) => {
  //meme logique que getArticleSwitch
  const pageName = "PS4"
  const page = req.params.page || 1
  const skip = (page - 1) * maxPerPage;
  const articlesPS4 = Article.find({
      console: "PS4"
    })
    .skip(skip)
    .limit(maxPerPage);
  const articlesPS4Count = Article.count({
    console: "PS4"
  });
  const [articles, count] = await Promise.all([articlesPS4, articlesPS4Count]);
  const pages = Math.ceil(count / maxPerPage);
  res.render('articlesAccueil', {
    articles,
    count,
    page,
    pages,
    pageName
  });

};
exports.getArticleXBoxOne = async (req, res) => {
  //meme logique que getArticleSwitch
  const pageName = "XBoxOne"
  const page = req.params.page || 1;
  const skip = (page - 1) * maxPerPage;
  const articlesXBoxOne = Article.find({
      console: "X Box One"
    })
    .skip(skip)
    .limit(maxPerPage);
  const articlesXBoxOneCount = Article.count({
    console: "X Box One"
  })
  const [articles, count] = await Promise.all([articlesXBoxOne, articlesXBoxOneCount]);
  const pages = Math.ceil(count / maxPerPage);
  res.render('articlesAccueil', {
    articles,
    count,
    page,
    pages,
    pageName
  });
};

exports.getArticleinde = async (req, res) => {
  //meme logique que getArticleSwitch
  const pageName = "Inde";
  const page = req.params.page || 1;
  const skip = (page - 1) * maxPerPage;
  const articlesJeuInde = Article.find({
      designation: "Indé"
    })
    .skip(skip)
    .limit(maxPerPage);

  const articlesJeuIndeCount = Article.count({
    designation: "Indé"
  })
  const [articles, count] = await Promise.all([articlesJeuInde, articlesJeuIndeCount]);
  const pages = Math.ceil(count / maxPerPage);
  res.render('articlesAccueil', {
    articles,
    count,
    page,
    pages,
    pageName
  });
};
exports.getArticlesCoupDeCoeur = async (req, res) => {
  //meme logique que getArticleSwitch
  const pageName = "Coeur";
  const page = req.params.page || 1
  const skip = (page - 1) * maxPerPage;
  const articlesCoupDeCoeur = Article.find({
      designation: "coeur"
    })
    .skip(skip)
    .limit(maxPerPage);
  const articlesCoupDeCoeurCount = Article.count({
    designation: "coeur"
  })
  const [articles, count] = await Promise.all([articlesCoupDeCoeur, articlesCoupDeCoeurCount]);
  const pages = Math.ceil(count / maxPerPage);
  res.render('articlesAccueil', {
    articles,
    count,
    page,
    pages,
    pageName
  });
};

exports.searchArticles = async (req, res) => {
  const articles = await Article
    .find({
      $text: {
        $search: req.query.q
      }
    }, {
      score: {
        $meta: 'textScore'
      }
    })
    .sort({
      score: {
        $meta: 'textScore'
      }
    })
    .limit(5);
  res.json(articles);
};



exports.getArticleHomePage = async (req, res) => {
  // on fait une requete pour récuperer les articles 
  const articlesGOTY = await Article.find({
    designation: "GOTY"
  }).limit(5);
  // on attends que la requête soit effectué avec await 
  //const articlesJeuInde = await Article.find({designation: "Indé"}).limit(5);
  res.render('homePage', {
    articlesGOTY
  }, ); // on montre la page d'accueil
};