const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

const path = require("path");
require('dotenv').config();

mongoose.connect(process.env.URI);

const itemSchema = new mongoose.Schema({
    name: String,
    category: String,
    quantity: Number
});

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name: "Pencil",
    category: "Stationary",
    quantity: 100
});
  
const item2 = new Item({
    name: "Pens",
    category: "Stationary",
    quantity: 50
});
  
const item3 = new Item({
    name: "Eraser",
    category: "Stationary",
    quantity: 25
});
  
const defaultItems = [item1, item2, item3];


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("adminhome");
});

app.get("/staff", function(req,res){
    res.render("staff");
});

app.get("/order", function(req,res){
    res.render("order");
});

Item.insertMany([item1,item2,item3]);

app.get("/product", async function(req, res) {
    try {
        const items = await Item.find({});
        res.render("product", { newListItems: items });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

app.get("/profile", function(req,res){
    res.render("profile");
});

app.get("/adminhome", function(req,res){
    res.render("adminhome");
});

app.post("/product", async function(req, res) {
    const name = req.body.itemName;
    const quantity = req.body.itemQuantity;
    const category = req.body.itemCategory;

    const item = new Item({
        name: name,
        quantity: quantity,
        category: category
    });

    try {
        await item.save();
        console.log("Item Saved:", item);
        res.redirect("/product");
    } catch (err) {
        console.log("Error Saving Item:", err);
        res.status(500).send("Server error");
    }
});


app.listen(3000, function(){
    console.log("Server started at port 3000");
});