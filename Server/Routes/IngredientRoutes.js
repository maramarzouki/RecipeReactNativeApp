const ingredientControllers = require('../Controllers/IngredientControllers')
const Route = require('express');

const router = Route();

router.post('/addIngredient', ingredientControllers.add_new_ingredient);
router.get('/getRecipeIngredients/:recipeID', ingredientControllers.get_recipe_ingredients);
router.get('/getIngredient/:ingredientID', ingredientControllers.get_ingredient);
router.put('/updateIngredient/:ingredientID', ingredientControllers.update_ingredient);
router.delete('/deleteIngredient/:ingredientID', ingredientControllers.delete_ingredient);

module.exports = router;