const mongoose = require('mongoose');

const instructionSchema = mongoose.Schema({
    stepNum: Number, 
    stepDesc: String,
    recipeID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipes',
        required: true,
    }
})

const instructionModel = mongoose.model('Instructions', instructionSchema);
module.exports = instructionModel;