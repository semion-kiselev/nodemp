const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://nodempuser:nodempuser@ds157185.mlab.com:57185/nodemp';

const mockedCities = [
    {"name": "Brest", "country": "Belarus", "capital": false, "location": {"lat": 52.097621, "long": 23.734050}},
    {"name": "Gomel", "country": "Belarus", "capital": false, "location": {"lat": 52.4345, "long": 30.9754}},
    {"name": "Minsk", "country": "Belarus", "capital": true, "location": {"lat": 53.9, "long": 27.56667}}
];

let db = null;
const collectionName = 'randomCities';

const server = http.createServer(async (req, res) => {
    req.on('error', err => console.error(err));
    res.on('error', err => console.error(err));

    const collection = db.collection(collectionName);
    const cities = await collection.find({}).toArray();
    const headers = {'Content-Type': 'application/json'};

    if (!cities.length) {
        res.writeHead(404, headers);
        res.end();
    }

    const randomIndex = Math.floor(Math.random()*cities.length);
    const randomCity = cities[randomIndex];
    res.writeHead(200, headers);
    res.end(JSON.stringify(randomCity));
});

const insertDocumentsIfNotExist = async (db) => {
    const collection = db.collection(collectionName);
    const cities = await collection.find({}).toArray();

    if (!cities.length) {
        await collection.insertMany(mockedCities);
    }
};

const start = async () => {
    try {
        db = await MongoClient.connect(dbUrl);
        await insertDocumentsIfNotExist(db);

        server.listen(3003);
    } catch (err) {
        throw err;
    }
};

start().catch(console.error);
