const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const adminPassword = encodeURIComponent("Frediecrueger1#");

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://andrija23:" + adminPassword + "@cluster0.dlayyjg.mongodb.net/test?retryWrites=true")

//API Creation

app.get("/", (req, res) => {
    res.send("Express App is Running");
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

//Creating Upload Endpoint for images

app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products
const Product = new mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    avilable: {
        type: Boolean,
        default: true
    }
})

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else{
        id = 1;
    }
    
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    });
    console.log(product);

    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    })
    
})

// Creating API for deleteing Products

app.post('/removeproduct', async (req, res) => {
    await Product.deleteOne({id: req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema creating for User model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    cartData:{
        type:Object
    },
    date: {
        type: Date,
        default: Date.now
    }
})  

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
    
    let check = await Users.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({
            success: false,
            errors: "User Already Exists"
        })
    }
    let cart = {};
    for(let i = 0; i< 300; i++){
        cart[i]= 0;
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    });
    await user.save();
    
    const data = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({
        success: true,
        token
    })
})

// Creating endpoint for user login
app.post('/login', async (req, res) => {
    let check = await Users.findOne({email: req.body.email});
    if(check){
        const passCompare = req.body.password === check.password;
        if(passCompare){
            const data = {
                user:{
                    id: check.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({
                success: true,
                token
            })
        }else{
            return res.json({
                success: false,
                errors: "Incorrect Password"
            })
        }
    }else{
        return res.json({
            success: false,
            errors: "Incorrect Email"
        })
    }
})

// Creating Endpoint for new collection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let new_collection = products.slice(1).slice(-8);
    console.log("New Collection Fetched");
    res.send(new_collection);
    
})

// Creating Endpoint for Popular in Women Section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({category: "women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
    
})

// Creating middelware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({
            errors: "Please authenticate using a valid token"
        })
    }
    else{
        try{
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({
                errors: "Please authenticate using a valid token"
            })
        }
    }
}

//Creating endpoints for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.ItemId);
    let userData = await Users.findOne({_id: req.user.id});
    userData.cartData[req.body.ItemId]  += 1;
    await Users.findOneAndUpdate({_id: req.user.id},{cartData: userData.cartData});
    res.send("Added");
})

// Creating Endpoint to Remove product from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.ItemId);
    let userData = await Users.findOne({_id: req.user.id});
    if(userData.cartData[req.body.ItemId] > 0){
        userData.cartData[req.body.ItemId]  -= 1;
    }
    await Users.findOneAndUpdate({_id: req.user.id},{cartData: userData.cartData});
    res.send("Removed");
})

// Creating Endpoint to get cartdata
app.post('/getcartdata', fetchUser, async (req, res) => {
    console.log("Get Cart Data");
    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error) => {
    if(!error){
        console.log(`Server is running on port ${port}`);
    }
    else{
        console.log("Error occurred, server can't start with error: " + error);
    }
})