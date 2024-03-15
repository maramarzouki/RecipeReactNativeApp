const savedRecipesControllers = require('../Controllers/SavedRecipeControllers')
const Route = require('express');

const router = Route();

router.post('/saveRecipe/:userID', savedRecipesControllers.saveRecipe);
router.get('/getSavedRecipes/:userID', savedRecipesControllers.getAllSavedRecipes);
router.delete('/unsaveRecipe/:userID', savedRecipesControllers.unsaveRecipe);

module.exports = router;