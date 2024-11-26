const express = require('express');
const youthController = require('../controllers/youthController');

const router = express.Router();

router.get('/', youthController.getAllyouths);
router.get('/:id', youthController.getyouthById);
router.post('/', youthController.createyouth);
router.put('/:id', youthController.updateyouth);
router.delete('/:id', youthController.deleteyouth);

module.exports = router;
