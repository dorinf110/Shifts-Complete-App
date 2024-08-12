var express = require('express');

var router = express.Router();

var userFunctions = require('../Controller/userFunctions');

router.post("/user",userFunctions.createUser);

router.post("/user/login",userFunctions.loginUser);

router.get('/user', userFunctions.protectUser,userFunctions.isAdmin, userFunctions.allUsers);

router.patch('/user/:id',userFunctions.protectUser,userFunctions.updateUser);

router.delete('/user/:id',userFunctions.protectUser,userFunctions.isAdmin,userFunctions.deleteUser);

router.get('/user/:id',userFunctions.protectUser,userFunctions.getUser);

module.exports = router;