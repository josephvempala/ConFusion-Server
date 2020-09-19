const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FavouritesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    dish:[{type:Schema.Types.ObjectId, ref: 'dish'}]
})



const Favourites = mongoose.model('favourite',FavouritesSchema);
module.exports=Favourites;