const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: `vous devez ajouter le nom de l'acheteur`
    },
    cart: {
        type: Object,
        require: true
    },
    address: {
        type: String,
        trim: true,
        lowercase: true
    }

})
module.exports = mongoose.model('Order', orderSchema);