
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const methodOverride = require("method-override");


const app=express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));



mongoose.connect("mongodb+srv://shreyas:665544@cluster0.i13kr.mongodb.net/blogDB?retryWrites=true&w=majority");

const blogSchema=new mongoose.Schema({
    username:String,
    title:String,
    desc:String
})

const Blog=mongoose.model("blogs",blogSchema);

app.get("/",(req,res)=>{
    res.send("<h1>Hello World</h1>");
})

app.get("/blogs",async(req,res)=>{
    const blogs=await Blog.find();
    console.log(blogs);
    res.render("index.ejs",{blogs:blogs});
})


app.get("/new-blog",(req,res)=>{
    const blog={title:"",username:"",desc:""};
    res.render("new_blog.ejs",{blog:blog});
})

app.post("/new-blog",async(req,res)=>{
    console.log(req.body);
    const blog=await Blog.findOne({title:req.body.title});
    if(blog)
    {
       Blog.updateOne({title:req.body.title},{desc:req.body.desc},function(err){
           if(err)
           {
               console.log(err);
           }
           else{
               console.log("Document updated");
           }
       })
    }
    else
    {
        const currBlog=new Blog({
            username:req.body.username,
            title:req.body.title,
            desc:req.body.desc
        })
        currBlog.save().then(()=>console.log("Doc"));
    }
    res.redirect("/blogs");
})

app.delete("/blogs/:id",async(req,res)=>{
    const id=req.params.id;
    await Blog.findByIdAndDelete(id);
    res.redirect("/blogs");
})

app.patch("/blogs/:id",async(req,res)=>{
    const blog=await Blog.findOne({_id:req.params.id});
    res.render("new_blog.ejs",{blog:blog});
})

app.listen(5000,()=>{
    console.log("Server started at localhost 5000");
})

