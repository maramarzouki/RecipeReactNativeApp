const instructionControllers = require('../Controllers/InstructionsControllers')
const Route = require('express');

const router = Route();

router.post('/addInstruction', instructionControllers.add_new_instruction);
router.get('/getRecipeInstructions/:recipeID', instructionControllers.get_recipe_instructions);
router.get('/getInstruction/:instructionID', instructionControllers.get_instruction);
router.put('/updateInstruction/:instructionID', instructionControllers.update_instruction);
router.delete('/deleteInstruction/:instructionID', instructionControllers.delete_instruction);

module.exports = router;