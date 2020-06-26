const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const articleSchema = new mongoose.Schema({ // on initialise notre schema
  name: {
    type: String,
    trim: true,
    required: true
  },
  slug: String,
  description: {
    type: String,
    trim: true,
    required: true
  },
  price: {
    type: Number,
    trim: true,
    required: true
  },
  console: {
    type: String,
    trim: true,
    required: true
  },
  tags: [String],
  taille: {
    type: String,
    trim: true,
    required: true
  },
  stock: {
    type: Number,
    trim: true,
    required: true
  },
  image: {
    type: String,
    trim: true,
    required: true
  },
  designation: {
    type: String,
    trim: true,
    required: true,
  }
});

articleSchema.index({ // on indexe le nom de notre article pour pouvoir l'utiliser avec notre barre de recherche  
  name: 'text'
});


module.exports = mongoose.model('Article', articleSchema); // on exporte notre model pour pouvoir l'utiliser