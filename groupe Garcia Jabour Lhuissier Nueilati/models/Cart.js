module.exports = function Cart(oldCart) { // notre panier est un objet que l'on modifie en fonction des requêtes de l'utilisateur 
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) { // notre fonction d'ajout au panier 
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price
        this.totalQty++;
        this.totalPrice += storedItem.price;
    };

    this.reduceByOne = function (id) { // la fonction qui permet d'enlever un article
        if (this.items[id].qty) {
            this.items[id].qty--;
            this.items[id].price -= this.items[id].item.price;
            this.totalQty--;
            this.totalPrice -= this.items[id].item.price;


            if (this.items[id].qty <= 0) { //si la quantité d'un article est nulle on
                delete this.items[id];
            }
            if (this.totalQty <= 0) { // on remet bien tout à 0 si la quantité totale est 0             
                this.totalQty = 0;
                this.totalPrice = 0;
                this.items = {};
            }
        }
    }.bind(this); // on utilise bind pour changer this 

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
        if (this.totalQty <= 0) {
            this.items = null;
            this.totalQty = 0;
            this.totalPrice = 0;

        }
    }.bind(this);

    this.generateArray = function () {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]); // on utilise un array pour nos articles afin de pouvoir les afficher
        }
        return arr;
    };

};