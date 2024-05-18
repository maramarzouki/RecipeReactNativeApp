// require('dotenv').config();
const User = require('../Models/UserModel')
const jwt = require('jsonwebtoken');
const prvKey = "prvkeyforrecipeappusertoken"
const bcrypt = require('bcrypt');
const { sendCode } = require('./nodemailer');
const stream_chat = require('stream-chat')

// dotenv.config();

// const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;

const STREAM_API_KEY = "ya7d29hmmd9m"
const STREAM_API_SECRET = "ac8trwcegut625s6xg5zkugdtgcbm9zr729877vzye5xub6n74qzsjq89f49dc9c"

const client = stream_chat.StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET)

const create_token = (_id) => {
    return jwt.sign({ _id }, prvKey);
}

exports.create_account = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.create_account(username, email, password);
        const token = create_token(newUser._id);
        const id = newUser._id.toString();
        await client.upsertUser({
            id, email, name: username
        })
        const stream_token = client.createToken(id);
        res.status(201).send({ Token: token, new_user: newUser, streamUserToken: stream_token, streamUserData: { id, email, username } });
    } catch (err) {
        console.log(STREAM_API_KEY, STREAM_API_SECRET);
        res.status(500).send({ ERROR: err.message });
    }
}

exports.login_user = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = create_token(user._id);
        res.status(200).send({ Token: token });
        console.log({ Token: token });
    } catch (err) {
        res.status(500).send({ ERROR: err.message });
    }
}

//verify if email exists in DB
exports.forgot_password = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email });
        if (user) {
            var code = (Math.floor(100000 + Math.random() * 900000)).toString();
            await user.updateOne({ $set: { changePasswordCode: code } })
                .then((result) => {
                    sendCode(email, code, user.username)
                    res.status(200).send(result)
                }).catch((err) => {
                    res.status(400).send(err.message)
                    console.log("EEEEEE", err);
                })
        } else {
            res.status(404).send({ ERROR: 'This user does not exist!' });
        }
        return;
    } catch (error) {
        console.log("EEEEEEEEEEEEEEEEEE:", error);
        // res.status(500).send({ ERROR: error.message });
    }
}

exports.verify_reset_password_code = async (req, res) => {
    const email = req.body.email;
    const code = req.body.code;

    try {
        const user = await User.findOne({ email })
        if (user) {
            if (user.changePasswordCode === code) {
                console.log("req body code: ", code);
                console.log("user code: ", user.changePasswordCode);
                res.status(200).send("Code is correct!")
            } else {
                console.log("req body code: ", code);
                console.log("user code: ", user.changePasswordCode);
                res.status(400).send("Code is not correct!")
            }
        } else {
            res.status(400).send("User not found!")
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message })
    }
}

exports.reset_password_from_signin = async (req, res) => {
    const userCode = req.body.code;
    const new_password = req.body.password;
    try {
        const user = await User.findOne({ changePasswordCode: userCode });

        if (user) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(new_password, salt);


            await user.updateOne({ $set: { password: hash } })
                .then(result => {
                    res.status(200).send(result)
                }).catch(err => {
                    res.status(400).send(err.message)
                })
        }
        else {
            res.status(400).send('User not found!')
        }
    } catch (err) {
        res.status(500).send({ ERROR: err.message })
    }
}

exports.reset_password = async (req, res) => {
    const new_password = req.body.password;

    try {
        const user = await User.findById({ _id: req.params.userID });

        if (user) {
            // const match = await bcrypt.compare(new_password, user.password);
            // if (match) {
            //     res.status(400).send('This is your old password!')
            // } else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(new_password, salt);


            await User.updateOne({ _id: req.params.userID }, { $set: { password: hash } })
                .then(result => {
                    res.status(200).send(result)
                }).catch(err => {
                    res.status(400).send(err.message)
                })
            // }
        } else {
            res.status(400).send('User not found!')
        }
    } catch (err) {
        res.status(500).send({ ERROR: err.message })
    }
}

exports.get_user_information = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userID });
        if (user) {
            res.status(200).send({ User: user })
        } else {
            res.status(404).send("User not found!");
        }
    } catch (err) {
        res.status(500).send({ ERROR: err.message });
    }
}

exports.update_user_information = async (req, res) => {
    const updates = req.body;
    try {
        const username = await User.findOne({ username: req.body.username });
        const email = await User.findOne({ email: req.body.email })

        if (username && (username._id).toString() !== req.params.userID) {
            res.status(400).send('Username already in use!')
        } else if (email && (email._id).toString() !== req.params.userID) {
            console.log('emailID', (email._id).toString());
            console.log('user id', req.params.userID);
            res.status(400).send('Email already exists!')
        } else {
            const user = await User.findById({ _id: req.params.userID });
            if (user) {
                await User.findByIdAndUpdate({ _id: req.params.userID }, { $set: updates }, { runValidators: true })
                    .then(result => {
                        res.status(200).send(result)
                    }).catch(err => {
                        res.status(400).send(err.errors)
                    })
            } else {
                res.status(404).send("User not found!");
            }
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
        console.log(error.message);
    }
}

exports.login_user_to_stream = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: req.body.email });
        const id = user._id.toString();
        console.log(id);
        const token = client.createToken(id);
    
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}