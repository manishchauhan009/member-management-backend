const express=require("express");
const router=express.Router();
const {registerMember,fetchMembers,updateMember,renewHandler}=require('../controllers/memberHandler')
const {isAdmin}=require('../middleware/authMiddleware')
const Member =require('../models/memberSchema')

router.post('/member-register',registerMember)
router.get('/get-member',fetchMembers)
router.post("/update-member/:id",updateMember)
router.post("/renew-member/:id", renewHandler);

module.exports = router;