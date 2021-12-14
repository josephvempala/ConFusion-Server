const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FavoritesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dishes: [{type: Schema.Types.ObjectId, ref: 'dish'}]
})


const Favorites = mongoose.model('favorite', FavoritesSchema);
module.exports = Favorites;