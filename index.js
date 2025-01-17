require("dotenv").config();
const upload = require("./routes/upload");
const faceRecognition = require("./routes/face-recognition");

const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const fileUpload = require('express-fileupload');
const { MetaData } = require("./middleware/model/meatadata");
var cors = require('cors')

// Connect to the database
connection();

// Create an instance of express
const app = express();
// Don't forget this line!

// Create an session 
let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});



app.use(cors())


// --------------------------------------------------------------------------------------------------------------------------------
// File Upload MiddleWare Call
app.use("/file", upload);
app.use("/retrieve",faceRecognition)

// Get file image by filename
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});


app.get("/", async (req,res)=>{

    res.status(500).json({Welcone:"To your Bucket"});
});

// --------------------------------------------------------------------------------------------------------------------------------
// Get all person meataData
app.get("/person", async (req,res)=>{
    MetaData.find().then(results=>{
        res.status(200).json({person:results});
    }).catch((err)=>{
        res.status(500).json({err:err})
    })
})
// Get person id by 
app.get("/person/:id", async (req, res)=>{
    MetaData.findById(req.params.id)
    .then(results=>{
        res.status(200).json({person:results});
    }).catch((err)=>{
        res.status(500).json({err:err})
    });
});


// Delete Person meta data by ID
app.delete("/person/:id", async (req,res)=>{
    try{
        const person= await MetaData.findById(req.params.id)
        if(person===null) return res.status(404).json({metaData:"ID Not-Found"});
        await MetaData.deleteOne({_id:person.id})
        await gfs.files.deleteOne({ filename: person.filename })
        res.status(200).json({
            deleted:true,
            person:person
        })
    }catch(err){
        res.status(500).json({err:err})
    }

});





// --------------------------------------------------------------------------------------------------------------------------------

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
