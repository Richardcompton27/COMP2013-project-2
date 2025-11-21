//initializing the model schema
const mongoose = require("mongoose")
const Schema = mongoose.Schema


const productSchema = new Schema({
   productName: {
    type: String,
    required: true,

   },
   brand: {
    type: String,
    required: true,
   },
   image: {
    type: String,
    required: false,
   },
   price:{
    type: String,
    required: true,
   },
});

//package and export
const Product = mongoose.model("Product", productSchema)
module.exports = Product;