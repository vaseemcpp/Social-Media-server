const requireUser = require('../middlewares/requireUser');
const UserController = require('../controllers/userController')
// const getPostOfFollowings = require('../controllers/userController')
const router = require('express').Router();

router.post('/follow',requireUser,UserController.followOrUnfollowUserController);
router.get('/getPostOfFollowings',requireUser,UserController.getPostOfFollowings);
router.get('/getMyPost', requireUser,UserController.getMyPost);
router.get('/getUserPosts', requireUser,UserController.getUserPosts);
router.delete('/deleteMyProfile', requireUser,UserController.deleteMyProfile);
router.get('/getMyInfo',requireUser,UserController.getMyInfo);
router.put('/',requireUser,UserController.updateUserProfile);
router.post('/getUserProfile',requireUser,UserController.getUserProfile);

module.exports = router;