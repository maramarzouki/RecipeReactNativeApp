const mongoose = require('mongoose')

const liveStreamSchema = mongoose.Schema({
    liveTitle:{
        type: String,
        required: true,
    },
    liveID:{ 
        type: Number,
        required: true,
    },
    liveOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    isLiveOn:{
        type: Boolean,
        default: false,
    },
})

const liveStreamModel = mongoose.model('LiveStreamData', liveStreamSchema);
module.exports = liveStreamModel;