
const express = require("express");
const router = express.Router();
const detectFace =require("../middleware/faceDetection/face-recognition")
const upload = require("../middleware/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
let gfs;
const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

router.post("/upload",upload.single("recfile"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    //Image Url
    const imgUrl = `https://polar-cove-18785.herokuapp.com/file/${req.file.filename}`;
    try{
        // Find Match
        let result =await detectFace(imgUrl)
        res.send({result:result})
        // Delete file stored
        await gfs.files.deleteOne({ filename: req.file.filename })
    }
    catch(error){
        res.send({error:error})
    }
    
});

module.exports = router;