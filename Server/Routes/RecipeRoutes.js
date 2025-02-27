const recipeControllers = require('../Controllers/RecipeControllers')
const Route = require('express');

const router = Route();

router.post('/createRecipe', recipeControllers.create_recipe);
router.get('/getRecipeDetails/:recipeID', recipeControllers.get_recipe_details);
router.get('/getAllRecipes/:userID', recipeControllers.get_all_recipes);
router.get('/getAppRecipes', recipeControllers.get_app_recipes)
router.get('/getRecipesByCategory/:category', recipeControllers.get_recipes_by_category)
router.get('/searchRecipe', recipeControllers.searchRecipes);
router.put('/updateRecipe/:recipeID', recipeControllers.update_recipe);
router.delete('/deleteRecipe/:recipeID', recipeControllers.delete_recipe);

module.exports = router;