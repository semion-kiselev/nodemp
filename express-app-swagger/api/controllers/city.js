'use strict';

const mongoose = require('mongoose');
const City = mongoose.model('City');
const {isObjectId} = require('../helpers/validator');

function getCities (req, res, next) {
    City.find()
        .then(cities => res.json(cities))
        .catch(err => next(err));
}

function addCity (req, res, next) {
    City.create(req.body)
        .then(city => res.json(city))
        .catch(err => next(err));
}

function updateCity (req, res, next) {
    const id = req.swagger.params.cityId.value;

    if (!isObjectId(id)) {
        return res.status(400).end();
    }

    City.findById(id)
        .then((city) => {
            Object.keys(req.body).forEach(prop => (city[prop] = req.body[prop]));
            return city.save();
        })
        .then(city => res.json(city))
        .catch(err => next(err));
}

function deleteCity (req, res, next) {
    const id = req.swagger.params.cityId.value;

    if (!isObjectId(id)) {
        return res.status(400).end();
    }

    City.findByIdAndRemove(id)
        .then(() => res.status(200).end())
        .catch(err => next(err));
}

module.exports = {
    getCities,
    addCity,
    updateCity,
    deleteCity
};