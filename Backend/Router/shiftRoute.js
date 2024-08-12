var express = require('express');

var router = express.Router();

var userFunctions = require('../Controller/userFunctions');
var shiftFunctions = require('../Controller/shiftFunctions');

router.post("/shifts",userFunctions.protectUser,shiftFunctions.addShift);

router.get('/shifts', userFunctions.protectUser,userFunctions.isAdmin, shiftFunctions.getAllShifts);

router.patch('/shifts/:id',userFunctions.protectUser,shiftFunctions.updateShiftById);

router.delete('/shifts/:id',userFunctions.protectUser,userFunctions.isAdmin,shiftFunctions.deleteShift);

router.get('/shifts/:id',userFunctions.protectUser,shiftFunctions.getShiftById);

router.get('/shifts/user/:id',userFunctions.protectUser,shiftFunctions.getShiftByUserId);

module.exports = router;