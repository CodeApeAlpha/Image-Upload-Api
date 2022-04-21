const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creation of meataData schema
const metaDataSchema = new Schema({
    first_name:{type:String, required:true},
    last_name: {type: String, required:true},
    gender: {type: String,required:true},
    imagLink:{type:String, required:true},
    fileName:{type:String,required:true}
},{collection: 'metaData' });

const MetaData = mongoose.model('MetaData', metaDataSchema);

module.exports= {MetaData};