const mongoose=require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema=mongoose.Schema;

let LeaderSchema = new Schema ({
    name:  {
        type: String,
        required: true
    },
    image:  {
        type: String,
        required: true
    },
    designation:  {
        type: String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    featured:{
        type:Boolean,
        default:true
    }
}, {
    timestamps: true
});

let Leaders=mongoose.model('leader',LeaderSchema);
module.exports=Leaders;