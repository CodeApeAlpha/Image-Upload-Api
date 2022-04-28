
const { log } = require("console");
const faceApi =require("face-api.js");
const path = require("path");
const modelPathRoot = "../../models";
const { MetaData } = require("../model/meatadata");





const detectFace= async(referenceImageURL)=>{

    try{
    // Acquire Library
    require('@tensorflow/tfjs-node');
    const faceApi = require('face-api.js');
    const canvas = require('canvas');
    const { Canvas, Image, ImageData } = canvas;
    console.log('Loaded successfully canvas');
    faceApi.env.monkeyPatch({ Canvas, Image, ImageData});
    console.log('Loaded successfully modules');

   
    console.log('Loading new models');
   
    const modelPath = path.join(__dirname, modelPathRoot);
    await faceApi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceApi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceApi.nets.ssdMobilenetv1.loadFromDisk(modelPath);

   
    console.log('loaded new models');
    const referenceImage = await canvas.loadImage(referenceImageURL)
    const referenceImageResult = await faceApi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor();
    // console.log({referenceImageResult:referenceImageResult});
    
    let listOfPeople= await MetaData.find();
    // const matched= await 

    for(let index=0;index<listOfPeople.length;index++){
      let queryImageUrl = listOfPeople[index].imagLink;
      let queryImage = await canvas.loadImage(queryImageUrl);
      let queryImageResult = await faceApi.detectSingleFace(queryImage).withFaceLandmarks().withFaceDescriptor();
      let distance = await faceApi.euclideanDistance(queryImageResult.descriptor, referenceImageResult.descriptor);
      if (distance<0.6) {
          console.log('MATCH');
          return {matched:listOfPeople[index]};
      }
    }
  } 
  catch (error) {
    console.log('==========================Error-Occurred=============================');
    console.log(error);
    return null;
  }
  return false;
}

module.exports= detectFace;
