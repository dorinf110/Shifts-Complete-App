var express = require('express');

var router = express.Router();

var userFunctions = require('../Controller/userFunctions');
var commentFunctions = require('../Controller/commentFunctions');

router.post("/comment",userFunctions.protectUser,commentFunctions.createComment);

router.get('/comment', userFunctions.protectUser,userFunctions.isAdmin, commentFunctions.getAllComments);

router.patch('/comment/:id',userFunctions.protectUser,commentFunctions.updateCommentById);

router.delete('/comment/:id',userFunctions.protectUser,userFunctions.isAdmin,commentFunctions.deleteComment);

router.get('/comment/:id',userFunctions.protectUser,commentFunctions.getCommentById);

router.get('/comment/user/:userId',userFunctions.protectUser,commentFunctions.getAllUserComments);

module.exports = router;