const userControllers = require('../Controllers/UserControllers');
const Router = require('express')

const router = Router();

router.post('/signup', userControllers.create_account);
router.post('/signin', userControllers.login_user);
router.put('/resetpassword/:userID', userControllers.reset_password);
router.get('/getUserDetails/:userID', userControllers.get_user_information);
router.put('/updateUserDetails/:userID', userControllers.update_user_information)
router.post('/verifyEmailBeforeResetPassword', userControllers.forgot_password)
router.post('/verifyResetPasswordCode', userControllers.verify_reset_password_code)
router.put('/resetPassword', userControllers.reset_password_from_signin)
router.post('/loginUserToStream', userControllers.login_user_to_stream);

module.exports = router;