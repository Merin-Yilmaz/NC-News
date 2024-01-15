// controller

const { fetchAllTopics } = require('../models/topics.models')

exports.getAllTopics = (req, res, next) => {

    fetchAllTopics().then((topics) => {
        console.log('in the controller');
        console.log(topics);
        res.status(200).send({ topics })
    })
};