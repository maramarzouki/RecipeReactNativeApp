const mongoose = require('mongoose')

const liveStreamSchema = mongoose.Schema({
    liveTitle:{
        type: String,
        required: true,
    },
    isLiveOn:{
        type: Boolean,
        default: false,
    },
    liveID:{ 
        type: String,
        required: true,
    },
    liveOwner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
})

const liveStreamModel = mongoose.model('LiveStreamData', liveStreamSchema);
module.exports = liveStreamModel;