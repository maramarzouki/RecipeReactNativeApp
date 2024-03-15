const Ingredient = require('../Models/IngredientModel')

exports.add_new_ingredient = async (req, res) => {
    try {
        const { name, quantity, unit, recipeID } = req.body;
        const newIngredient = await Ingredient.create({ name, quantity, unit, recipeID })
        res.status(200).send(newIngredient)
    } catch (error) {
        console.log("Error in add_new_ingredient:", error);
        res.status(500).send({ ERROR: error.message })
    }
}

exports.update_ingredient = async (req, res) => {
    const updates = req.body;
    try {
        await Ingredient.findByIdAndUpdate({ _id: req.params.ingredientID }, updates)
            .then(() => {
                res.status(200).send("ingredient updated!")
            }).catch(error => {
                res.status(400).send({ err: error.message })
            })
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
}

exports.get_ingredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById({ _id: req.params.ingredientID });
        if (ingredient) {
            res.status(200).send({ ingredient: ingredient })
        } else {
            res.status(404).send("ingredient not found!");
        }
    } catch (err) {
        res.status(500).send({ ERROR: err.message });
    }
}

exports.get_recipe_ingredients = async (req, res) => {
    try {
        const ingredient = await Ingredient.find({ recipeID: req.params.recipeID });
        if (ingredient) {
            res.status(200).send(ingredient)
        } else {
            res.status(204).send("Ingredients list is empty!");
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.delete_ingredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndDelete({ _id: req.params.ingredientID })
        if (ingredient) {
            res.status(200).send({ msg: "ingredient deleted!" });
        } else {
            res.status(404).send({ msg: "ingredient not found!" });
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message })
    }
}