const express=require("express");
const router=express.Router();
const {isAdmin}=require('../middleware/authMiddleware')
const {addEvent,getEvent}=require('../controllers/eventHandler');

router.post('/add-event',isAdmin,addEvent);
router.get('/get-event',getEvent);

module.exports = router;