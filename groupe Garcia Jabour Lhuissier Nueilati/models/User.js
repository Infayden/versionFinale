const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5'); // on requiert md5 pour passport
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'], //on valide le type de l'email avant de l'insérer on verifie s'il y a bien un point et un @
    required: 'Please Supply an email address'
  },
  firstName: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true
  },
  address: {
    type: String,
    trim: true,
  },
  resetPasswordToken: String, //ce sont les token, ils sont temporaires a voir authController
  resetPasswordExpires: Date
});



userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
}); // on specifie a passport quel est le champ utilisée comme login 
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);