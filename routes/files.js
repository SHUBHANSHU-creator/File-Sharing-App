const router=require('express').Router();
const multer=require('multer');
const path = require('path');
const File=require('../models/file');
const{v4:uuid4}=require('uuid');

let storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'uploads/')
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, filename );
      }
}) 

let upload=multer({
    storage:storage,
    limit:{fileSize:1000000*100}
}).single('myfile');

router.post('/',function(req,res){
    //store file
       upload(req,res,async function(err){
        
        
        //Validate request
        if(!req.file){
            return res.json({error:"File not found for upload"})
        }

           if(err){
               return res.status(500).send({error:err.message})
           } 


           //Store in database
           const file=new File({
               filename:req.file.filename,
               uuid:uuid4(),
               path:req.file.path,
               size:req.file.size

           });

           const response=await file.save()
           return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
       })


    


    //Response-> download link

})

module.exports=router