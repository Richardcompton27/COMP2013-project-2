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