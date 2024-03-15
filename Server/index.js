const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const UserRoutes = require('./Routes/UserRoutes');
const RecipeRoutes = require('./Routes/RecipeRoutes');
const IngredientRoutes = require('./Routes/IngredientRoutes')
const InstructionRoutes = require('./Routes/InstructionRoutes');
const SavedRecipeRoutes = require('./Routes/SavedRecipesRoutes')

mongoose.connect('mongodb://0.0.0.0:27017/RecipeMobileApp')

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/', UserRoutes);
app.use('/', RecipeRoutes);
app.use('/', IngredientRoutes);
app.use('/', InstructionRoutes);
app.use('/', SavedRecipeRoutes);

const port = process.env.PORT || 3001;
app.listen(port, console.log(`Listening on port ${port}...`));