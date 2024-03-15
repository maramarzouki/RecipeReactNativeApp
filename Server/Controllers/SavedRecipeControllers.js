const SavedRecipe = require('../Models/SavedRecipeModel');

exports.saveRecipe = async (req, res) => {
    const recipeID = req.body;
    const userID = req.params.userID
    if (!recipeID || !userID) {
        return res.status(400).json({ error: 'Both recipeID and userID are required.' });
    }
    try {
        const existingSavedRecipes = await SavedRecipe.findOne({ userID })
        if (!existingSavedRecipes) {
            const newSavedRecipe = await new SavedRecipe({
                recipesIDs: [recipeID],
                userID
            });

            await newSavedRecipe.save();
            res.status(201).json({ message: 'Recipe saved successfully.', newSavedRecipe });
        } else {
            existingSavedRecipes.recipesIDs.push(recipeID);
            await existingSavedRecipes.save();
            res.status(200).json({ message: 'Recipe added to the saved recipes.' });
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getAllSavedRecipes = async (req, res) => {
    try {
        const recipes = await SavedRecipe.find({ userID: req.params.userID })
            .populate('recipes')
        if (recipes) {
            res.status(200).send(recipes)
        } else {
            res.status(204).send("recipes list is empty!");
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.unsaveRecipe = async (req, res) => {
    const recipeID = req.body;
    const userID = req.params.userID

    if (!recipeID || !userID) {
        return res.status(400).json({ error: 'Both recipeID and userID are required.' });
    }
    try {
        const existingSavedRecipe = await SavedRecipe.findOne({ userID });

        if (!existingSavedRecipe) {
            return res.status(404).json({ error: 'User not found or no recipes saved.' });
        }

        // Use $pull to remove the specified recipeID from the recipesIDs array
        existingSavedRecipe.recipesIDs.pull(recipeID);

        await existingSavedRecipe.save();
        res.status(200).json({ message: 'Recipe removed from saved recipes.' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}