const express= require("express");
const app=express();
const bodyParser = require("body-parser");
const { response } = require("express");
const mongoose=require('mongoose');
const ejs=require('ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'))
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB")

var itemSchema={
    todo:String
};

var Item=new mongoose.model('Item',itemSchema);

var Workitem=new mongoose.model('Workitem',itemSchema);
const item1=new Item({
    todo:"Welcome to Todo list!"
})
const item2=new Item({
    todo:"< -- Click here to strike off any Todo Item"
})

const item3=new Item({
    todo:"Enter the Todo and click on + to enter it"
})
const defaultItems=[item1,item2,item3]
app.get('/',(req,res)=>{
    Item.find((err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result.length);
            if(result.length===0){
                Item.insertMany(defaultItems);
                res.redirect('/')
            }
            else{
                res.render('index.ejs',{
                    day: "Today",
                    items: result,
                })
            }
        }
    });
})

var  listSchema={
    name1:String,
    items:[itemSchema]
}
var List=new mongoose.model('List',listSchema);
app.get('/:name',(req,res)=>{
    const listname=req.body.name;
    const default1=new List({
        name1:listname,
        items:defaultItems
    })
    default1.save();
})
app.post('/delete',(req,res)=>{
    console.log(req.body.Checkbox);
    Item.findOneAndDelete({_id:req.body.Checkbox},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(result)
        }
    })
    res.redirect('/')
})
app.post('/',(req,res)=>{
    if(req.body.list=="Work"){
        var entry=new Workitem({
            todo:req.body.txt
        })
        entry.save();
        res.redirect('/work')
    }
    else{
        var entry=new Item({
            todo:req.body.txt
        })
        entry.save();
        res.redirect('/')
    }
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.listen(3000,()=>{
    console.log("server started!")
})