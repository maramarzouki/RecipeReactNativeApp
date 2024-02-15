const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const UserRoutes = require('./Routes/UserRoutes');

mongoose.connect('mongodb://0.0.0.0:27017/RecipeMobileApp')

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/', UserRoutes)
const port = process.env.PORT || 3001;
app.listen(port, console.log(`Listening on port ${port}...`));