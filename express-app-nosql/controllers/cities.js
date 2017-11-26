const mongoose = require('mongoose');
const City = mongoose.model('City');
const mergeDeepRight = require('ramda/src/mergeDeepRight');
const {isObjectId} = require('../helpers/validator');

exports.getCities = async (req, res, next) => {
    try {
        const cities = await City.find();
        res.json(cities);
    } catch(err) {
        next(err);
    }
};

exports.addCity = async (req, res, next) => {
    try {
        const createdCity = await City.create(req.body);
        res.json(createdCity);
    } catch(err) {
        next(err);
    }
};

exports.updateCity = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(400).end();
        }

        const city = await City.findById(id);
        Object.keys(req.body).forEach(prop => (city[prop] = req.body[prop]));
        await city.save();
        return res.json(city);
    } catch(err) {
        next(err);
    }
};

exports.deleteCity = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(400).end();
        }

        await City.findByIdAndRemove(id);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
};
