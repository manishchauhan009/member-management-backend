const express=require("express");
const router=express.Router();
const {addContent,getContent}=require('../controllers/contentHandler')
const {isAdmin}=require('../middleware/authMiddleware')
// const Content =require('../models/memberSchema')

router.post('/add-content',isAdmin,addContent);
router.get('/get-content',getContent);
// router.get('/content/:id',getContentById);
// router.delete('/content/:id',getContentById);



module.exports = router;