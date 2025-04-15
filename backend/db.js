const { MongoClient } = require('mongodb');
var url = "mongodb://localhost:27017/";

const mongo = new MongoClient(url)

let db = null;

async function connectToDatabase() {
    if (!db) {
        await mongo.connect();
        db = mongo.db('dungeon-architect-mongoDB');
        console.log("MongoDB verbunden");
    }
    return db;
}

function closeMongoConnection() {
    mongo.close().then(() => {
        console.log('MongoDB-Verbindung geschlossen');
        process.exit(0);
    });
}


process.on('SIGINT', closeMongoConnection);
process.on('SIGTERM', closeMongoConnection);


module.exports = connectToDatabase;