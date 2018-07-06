var bodyparser = require("body-parser"),
  mongoose = require("mongoose"),
  express = require("express"),
  expressSanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  app = express();

//APP CONFIG
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); //put it only after bodyparser


mongoose.connect("mongodb://localhost/blogapp",{
  useMongoClient:true
});
mongoose.Promise = global.Promise;

// MONOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title:String,
  image:{type:String, default:"default.jpg"},
  body:String,
  created:{type:Date, default:Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES
app.get("/",function(req,res){
  res.redirect("/blogs")
})

//INDEX ROUTE
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if (err) {
      console.log(err);
    } else {
      res.render("index.ejs",{blogs:blogs})
    }
  })
})

//NEW ROUTE
app.get("/blogs/new",function(req,res){
  res.render("new.ejs");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
//create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,function(err,newBlog){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs")
    }
  })
})

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){

  Blog.findById(req.params.id,function(err,blog){
    if (err) {
      console.log(err);
    } else {
      res.render("show.ejs",{blog:blog})
    }
  })
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,blog){
    if (err) {
      res.send(err)
    } else {
      res.render("edit.ejs",{blog:blog});
    }
  })

})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    if (err) {
      res.send(err);
    } else {
      res.redirect("/blogs/"+req.params.id);
    }
  })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      res.send(err);
    }else {
      res.redirect("/blogs");
    }
  })
})



app.listen(3823,function(){
  console.log("server is running");
})
