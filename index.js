require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const { MetaData } = require("./middleware/model/meatadata");




// Connect to the database
connection();

// Create an instance of express
const app = express();
// app.use(fileUpload()); 
// Don't forget this line!

// Create an session 
let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});



// --------------------------------------------------------------------------------------------------------------------------------
// File Upload MiddleWare Call
app.use("/file", upload);


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

// Delete file image  by filename
// app.delete("/file/:filename", async (req, res) => {
//     try {
//         await gfs.files.deleteOne({ filename: req.params.filename });
//         res.send("success");
//     } catch (error) {
//         console.log(error);
//         res.send("An error occured.");
//     }
// });
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

   const person= await MetaData.findById(req.params.id).catch((err)=>{
                    res.status(500).json({err:err})
                });
    await MetaData.deleteOne({_id:person.id}).catch((err)=>{
                res.status(500).json({err:err})
            });
    await gfs.files.deleteOne({ filename: person.filename }).catch((err)=>{
                res.status(500).json({err:err})
    });
    res.status(200).json({
        deleted:true,
        person:person
    })
});




// --------------------------------------------------------------------------------------------------------------------------------

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
