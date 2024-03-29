const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    durationHours: {
        type: Number,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    cuisineType: {
        type: String,
    },
    category: {
        type: String,
    },
    tags: [String],
    isOwnRecipe:{
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
})

const RecipeModel = mongoose.model('Recipes', recipeSchema);
module.exports = RecipeModel;