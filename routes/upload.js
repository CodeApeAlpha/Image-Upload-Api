const upload = require("../middleware/upload");
const {MetaData}= require("../middleware/model/meatadata");
const express = require("express");
const router = express.Router();



router.post("/upload", upload.single("recfile"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `https://polar-cove-18785.herokuapp.com/file/${req.file.filename}`;
    MetaData.create({
        first_name:req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        imagLink:imgUrl,
        fileName:`${req.file.filename}`

    }).then((result)=>{
        res.status(201).json(result);
    }).catch((err)=>{
        res.status(500).json(err);
    })
});

module.exports = router;
