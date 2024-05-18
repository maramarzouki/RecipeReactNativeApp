const LiveStream = require('../Models/LiveStreamModel')

exports.createLive = async (req, res) => {
    try {
        const { liveTitle, liveID, liveOwner } = req.body;
        const newLive = await LiveStream.create({ liveTitle, liveID, liveOwner, isLiveOn: true })
        res.status(200).send(newLive)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ ERROR: error.message })
    }
}

exports.get_live_details = async (req, res) => {
    try {
        const live = await LiveStream.findById({ _id: req.params.liveID });
        if (live) {
            res.status(200).send({ live: live })
        } else {
            res.status(404).send("live not found!");
        }
    } catch (err) {
        res.status(500).send({ ERROR: err.message });
    }
}

exports.get_all_lives = async (req, res) => {
    try {
        const lives = await LiveStream.find({}).populate('liveOwner', 'username');
        if (lives.length > 0) { 
            res.status(200).send(lives);
        } else {
            res.status(204).send("No live found!");
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
}

exports.delete_live = async (req, res) => {
    try {
        const live = await LiveStream.findByIdAndDelete({ _id: req.params.liveID })
        if (live) {
            res.status(200).send({ msg: "live deleted!" });
        } else {
            res.status(404).send({ msg: "live not found!" });
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message })
    }
}