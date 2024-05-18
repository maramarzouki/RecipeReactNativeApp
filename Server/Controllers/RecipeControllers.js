const Recipe = require('../Models/RecipeModel');
const levenshtein = require('js-levenshtein')

// exports.create_recipe = async (req, res) => {
//     const {
//         title, description, duration, durationUnit, level, image, ingredients,
//         instructions, cuisineType, mealType, nutritionalInfo, tags, user
//     } = req.body;

//     try {
//         const ingredientPromises = ingredients.map(async (ingredient) => {
//             return await Ingredient.create(ingredient);
//         });

//         // Create instances of Instruction for each item in the instructions array
//         const instructionPromises = instructions.map(async (instruction) => {
//             return await Instruction.create(instruction);
//         });

//         const createdIngredients = await Promise.all(ingredientPromises);
//         const createdInstructions = await Promise.all(instructionPromises);

//         console.log(createdIngredients.map(ingredient => new ObjectId(ingredient._id).toString()));
//         console.log(createdInstructions);

//         const newRecipe = await Recipe.create({
//             title,
//             description,
//             duration,
//             durationUnit,
//             level,
//             image,
//             ingredients: createdIngredients.map(ingredient => new ObjectId(ingredient._id).toString()),
//             instructions: createdInstructions.map(instruction => new ObjectId(instruction._id).toString()),
//             cuisineType,
//             mealType,
//             nutritionalInfo,
//             tags,
//             user
//         });
//         res.status(200).send(newRecipe);
//     } catch (error) {
//         res.status(500).send({ ERROR: error.message });
//     }
// }

exports.create_recipe = async (req, res) => {
    const {
        title, description, durationHours, durationMinutes, level, image, cuisineType, category, tags, isOwnRecipe, user
    } = req.body;

    try {
        const newRecipe = await Recipe.create({
            title,
            description,
            durationHours,
            durationMinutes,
            level,
            image,
            cuisineType,
            category,
            tags,
            isOwnRecipe,
            user
        });
        res.status(200).send(newRecipe);
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.get_recipe_details = async (req, res) => {
    try {
        const recipe = await Recipe.findById({ _id: req.params.recipeID });
        res.status(200).send(recipe)
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.update_recipe = async (req, res) => {
    const updates = req.body
    try {
        try {
            await Recipe.findByIdAndUpdate({ _id: req.params.recipeID }, { $set: updates })
                .then(() => {
                    res.status(200).send("recipe updated!")
                }).catch(error => {
                    res.status(400).send({ err: error.message })
                })
        } catch (error) {
            res.status(500).send({ err: error.message })
        }
    } catch (error) {

    }
}

exports.get_all_recipes = async (req, res) => {
    try {
        const recipe = await Recipe.find({ user: req.params.userID });
        if (recipe.length > 0) {
            res.status(200).send(recipe)
        } else {
            res.status(204).send("recipes list is empty!");
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.get_recipes_by_category = async (req, res) => {
    try {
        const recipe = await Recipe.find({ category: req.params.category });
        if (recipe) {
            res.status(200).send(recipe)
        } else {
            res.status(204).send("recipes list is empty!");
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.delete_recipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete({ _id: req.params.recipeID })
        if (recipe) {
            res.status(200).send({ msg: "recipe deleted!" });
        } else {
            res.status(404).send({ msg: "recipe not found!" });
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message })
    }
}

exports.get_app_recipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        if (recipes.length > 0) {
            res.status(200).send(recipes)
        } else {
            res.status(204).json({message:"Recipes list is empty!"});
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.searchRecipes = async (req, res) => {
    const { query } = req.query;

    try {
        const allRecipes = await Recipe.find({});

        const searchResults = allRecipes.filter(recipe => {
            for (const key in recipe) {
                if (typeof recipe[key] === 'string') {
                    const attribute = recipe[key].toLowerCase();
                    if (levenshtein(attribute, query.toLowerCase()) < 4) {
                        return true;
                    }
                }
            }
            return false; // If no attribute is similar, exclude the recipe
        });


        // const searchResults = allRecipes.filter(recipe => {
        //     const title = recipe.title.toLowerCase();
        //     return levenshtein(title, query.toLowerCase()) < 3;
        // })

        res.status(200).send(searchResults);
    } catch (error) {
        console.error('Error searching recipes:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// exports.searchRecipes = async (req, res) => {
//     const { query } = req.query;

//     try {
//         // Use a regular expression to perform a case-insensitive search
//         const regex = new RegExp(query, 'i');

//         // Find recipes that match the search query
//         const searchResults = await Recipe.find({ title: regex });

//         res.status(200).json({ results: searchResults });
//     } catch (error) {
//         console.error('Error searching recipes:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }