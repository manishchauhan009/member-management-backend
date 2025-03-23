const express=require("express");
const router=express.Router();
const {isAdmin}=require('../middleware/authMiddleware')
const {addImage,getImage}=require('../controllers/imageHandler');

router.post('/add-gallery',isAdmin,addImage);
router.get('/get-image',getImage);

module.exports = router;