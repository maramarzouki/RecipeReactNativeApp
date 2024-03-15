const Instruction = require('../Models/InstructionModel');

exports.add_new_instruction = async (req, res) => {
    try {
        const { stepNum, stepDesc, recipeID } = req.body;
        const newInstruction = await Instruction.create({ stepNum, stepDesc, recipeID })
        res.status(200).send(newInstruction)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ ERROR: error.message })
    }
}

exports.update_instruction = async (req, res) => {
    const updates = req.body;
    try {
        await Instruction.findByIdAndUpdate({ _id: req.params.instructionID }, updates)
            .then(() => {
                res.status(200).send("instruction updated!")
            }).catch(error => {
                res.status(400).send({ err: error.message })
            })
    } catch (error) {
        res.status(500).send({ err: error.message })
    }
}

exports.get_instruction = async (req, res) => {
    try {
        const instruction = await Instruction.findById({ _id: req.params.instructionID });
        if (instruction) {
            res.status(200).send({ instruction: instruction })
        } else {
            res.status(404).send("instruction not found!");
        }
    } catch (err) {
        res.status(500).send({ ERROR: err.message });
    }
}

exports.get_recipe_instructions = async (req, res) => {
    try {
        const instruction = await Instruction.find({ recipeID: req.params.recipeID });
        if (instruction) {
            res.status(200).send(instruction)
        } else {
            res.status(204).send("instructions list is empty!");
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.delete_instruction = async (req, res) => {
    try {
        const instruction = await Instruction.findByIdAndDelete({ _id: req.params.instructionID })
        if (instruction) {
            res.status(200).send({ msg: "instruction deleted!" });
        } else {
            res.status(404).send({ msg: "instruction not found!" });
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message })
    }
}
