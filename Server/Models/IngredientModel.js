const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    name: String,
    quantity: String,
    unit: String,
    optional: Boolean,
    
    recipeID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipes',
        required: true,
    }
})

const ingredientModel = mongoose.model('Ingredients', ingredientSchema)
module.exports = ingredientModel;