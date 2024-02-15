const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var validate_email = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var validate_username = (username) => {
    var re = /^[a-zA-Z0-9_]+$/; // Allow only alphanumeric characters and underscores
    return re.test(username);
};

const getCurrentYear = () => {
    return new Date().getFullYear();
}

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: [validate_username, 'Invalid username format']
    },
    email: {
        type: String,
        required: true,
        validate: [validate_email, "Invalid email format"],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    memberSince:{
        type: Number,
        default: getCurrentYear()
    },
    changePasswordCode:{
        type: Number,
        default: 111111
    }
})

userSchema.statics.create_account = async function (username, email, password) {
    const [userName, userEmail] = await Promise.all([
        this.findOne({ username }),
        this.findOne({ email })
    ]);

    if (userName) {
        throw new Error('Username already taken!');
    }

    if (userEmail) {
        throw new Error('Email already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = this.create({ username, email, password: hash });
    console.log(user);
    return user;
}

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if(!email || !password){
        throw Error("All fields are required!");
    }

    if(!user){
        throw new Error("User doesn't exist!");
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        throw new Error("Password is not correct!");
    }

    return user;
}

const UserModel = mongoose.model('Users', userSchema);
module.exports = UserModel;