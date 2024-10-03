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

//////////////////////////////Requests Targeting All Articles//////////////////////////////

app.route("/articles")
.get(
    async (req, res) => {
        try {
            const foundArticles = await Article.find();
            res.send(foundArticles);
        } catch (err) {
            console.log(err);
        }
    }
)
.post(
    async (req, res) => {
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
    }
)
.delete(
    async (req, res) => {
        try {
            await Article.deleteMany();
            res.send("Successfully deleted all articles.");
        } catch (err) {
            res.send(err);
        }
    }
);

//////////////////////////////Requests Targeting Specific Articles//////////////////////////////

app.route("/articles/:articleTitle")

.get(
    async (req, res) => {
        try {
            const foundArticle = await Article.findOne({title: req.params.articleTitle});
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        } catch (err) {
            res.send(err);
        }
    }
)

.put(
    async (req, res) => {
        try {
            await Article.updateOne(
                {title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content},
                {overwrite: true}
            );
            res.send("Successfully updated article.");
        } catch (err) {
            res.send(err);
        }
    }
)

.patch(
    async (req, res) => {
        try {
            await Article.updateOne(
                {title: req.params.articleTitle},
                {$set: req.body}
            );
            res.send("Successfully updated article.");
        } catch (err) {
            res.send(err);
        }
    }
)

.delete(
    async (req, res) => {
        try {
            await Article.deleteOne({title: req.params.articleTitle});
            res.send("Successfully deleted the corresponding article.");
        } catch (err) {
            res.send(err);
        }
    }
);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});