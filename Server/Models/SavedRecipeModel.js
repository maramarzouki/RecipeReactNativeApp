const mongoose = require('mongoose');

const savedRecipeSchema = mongoose.Schema({
    recipesIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipes',
        required: true
    }],
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const savedRecipeModel = mongoose.model('UserSavedRecipes', savedRecipeSchema);
module.exports = savedRecipeModel;