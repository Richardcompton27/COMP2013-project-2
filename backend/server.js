//server

const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");//import mongoose
require("dotenv").config();//import dotenv
const { DB_URI } = process.env; // grab the same varaible from the dotenv file
const cors = require("cors");
const Product = require("./models/product"); //importing the model schema

//middleware

server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cors())

//server connection

mongoose.connect(DB_URI).then(() => {
    server.listen(port, () => {
        console.log(`Database is connected \nserver is listening on ${port}`);
    });
}).catch((error) => console.log(error.message));




//routes
//root route

server.get("/", (request, response) => {
    response.send("server is live!");
})

server.get("/products", async (request, response) => {
    try{
        const products = await Product.find()
        response.send(products)
    }catch(error){
        response.status(500).send({message: error.message})
    }
});

//to post a new product to db
server.post("/products", async (request, response) => {
    const{id, productName, brand, image, price} = request.body
    const newProduct = new Product({
        id,// added this in hopes of being an easy way to keep my system for updating quantity and doing all those changed using the id without switching to mongos _id
        productName,
        brand, 
        image,
        price,
    });
    try{
        await newProduct.save();
        response.status(200).send({message: "Product is added successfully!"});
    }catch(error){
        response.status(400).send({message: error.message})
    }
});

//to delete a product from db by its id
server.delete("/products/:id", async (request, response) => {
    const { id } = request.params;
    try{
        await Product.findByIdAndDelete(id);
        resoonse.send({message: `contact is deleted with the ${id}`});
    }catch(error){
    response.status(400).send({message: error.message });
    }
});

//to get one product by id
server.get("/products/:id", async (request, response) => {
    const{id} = request.params
    try{
        const productToEdit = await Product.findById(id)
        response.send(productToEdit);
    }catch(error)
    {response.status(500).send({message: error.message})};
    
})

//to patch a product by id
server.patch("/products/:id", async (request, response) => {
    const { id } = request.params;
    const { productName, brand, image, price } = request.body;
    try{
        await Product.findByIdAndUpdate(id, {
            productName,
            brand,
            image,
            price,
        });
        response.send({message: `Contact has been updated with id ${id}`})
    }catch(error){
        response.status(500).send({message: error.message});
    }
});
