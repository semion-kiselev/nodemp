const express = require('express');
const router = express.Router();
const {
    login,
    authWithGoogle,
    loginWithGoogle,
    authWithTwitter,
    loginWithTwitter,
    authWithFacebook,
    loginWithFacebook
} = require('../controllers/auth');

router.post('/', login);
router.get('/google', authWithGoogle);
router.get('/google/callback', loginWithGoogle);
router.get('/twitter', authWithTwitter);
router.get('/twitter/callback', loginWithTwitter);
router.get('/facebook', authWithFacebook);
router.get('/facebook/callback', loginWithFacebook);

module.exports = router;
