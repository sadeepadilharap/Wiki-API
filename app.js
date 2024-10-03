const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", async (req, res) => {
    try {
        const foundArticles = await Article.find();
        res.send(foundArticles);
    } catch (err) {
        console.log(err);
    }
});

app.post("/articles", async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
      });
  
      await newArticle.save(); // Await the save operation
      res.send("Successfully added a new article.");
    } catch (err) {
      res.status(500).send(err); // Handle any error and respond with status 500
    }
});
  

app.delete("/articles",async (req, res) => {
    try {
        await Article.deleteMany();
        res.send("Successfully deleted all articles.");
    } catch (err) {
        res.send(err);
    }
});


//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});