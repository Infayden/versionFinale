const fs = require('fs');

// dump est une fonction de debuggage très utile elle s'apparente au var_dump du PHP
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// quelques details du site 
exports.siteName = `Boot`;

exports.menu = [{
    slug: '/PS4', //  on aura ici l'adresse /PS4
    title: 'Playstation',
  },
  {
    slug: '/XBoxOne', //  on aura ici l'adresse /XBoxOne
    title: 'Xbox',
  },
  {
    slug: '/Nintendo', //  on aura ici l'adresse /nintendo
    title: 'Nintendo',
  },
  {
    slug: '/coeur', //  on aura ici l'adresse /coeur
    title: 'Coup de coeur'
  },
  {
    slug: '/inde', //  on aura ici l'adresse /inde
    title: 'Jeux indépendants',
  }
];

exports.profileMenu = [{
    slug: '/historique',
    title: 'Historique des achats'
  },
  {
    slug: '/profile',
    title: 'Information profile'
  },
  // {
  //   slug: '/mesCommentaires',
  //   titre: 'Mes commentaires'
  // }
]
// exports.categories = [{ slug: '/add', title: 'f'},{ slug: '/add', title: 'f'},] ;// todo 