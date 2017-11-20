const mongoose = require('mongoose');
const City = mongoose.model('City');
const mergeDeepRight = require('ramda/src/mergeDeepRight');

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
        const city = await City.findById(req.params.id);
        Object.keys(req.body).forEach(prop => (city[prop] = req.body[prop]));
        await city.save();
        res.json(city);
    } catch(err) {
        next(err);
    }
};

exports.deleteCity = async (req, res, next) => {
    try {
        await City.findByIdAndRemove(req.params.id);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
};
