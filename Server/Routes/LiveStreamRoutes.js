const liveStreamControllers = require('../Controllers/LiveStreamControllers')
const Route = require('express');

const router = Route();

router.post('/createLive', liveStreamControllers.createLive);
router.get('/getAllLives', liveStreamControllers.get_all_lives);
router.get('/getLiveDetails/:liveID', liveStreamControllers.get_live_details);
router.delete('/deleteLive/:liveID', liveStreamControllers.delete_live);

module.exports = router;