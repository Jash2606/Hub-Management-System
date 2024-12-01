const express = require('express');
const { getServiceTAT, getHubTAT } = require('../controller/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/service-tat', authMiddleware, restrictTo('Admin','Hub Ops'), getServiceTAT);
router.get('/hub-tat', authMiddleware, restrictTo('Admin', 'Hub Ops','TUT'), getHubTAT);

module.exports = router;
