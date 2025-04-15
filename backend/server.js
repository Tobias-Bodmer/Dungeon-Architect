const https = require('https');
const fs = require('fs');
const express = require('express');
const connectToDatabase = require('./db');
const port = 1337;

const app = express()
app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.post('/registrate', async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");
        //TODO: database query / comparison / insert
        const cursor = collection.find();


        res.status(200).send({
            message: `${mail} is now registrated!`
        });

    } catch (error) {
        if (err.code === 11000) { // Mongo Duplicate Key Error
            res.status(409).json({ error: "Benutzer existiert bereits" });
        } else {
            console.error("Fehler beim Insert:", err);
            res.status(500).send({ error: `${error}` });
        }
    }
})

app.post('/login', async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        //TODO: database query / comparison
        const cursor = collection.find();
        const results = await cursor.toArray();

        console.log(results);


        res.status(200).send({
            message: `${mail} was successfully logged in!`
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})

app.post('/haski', (req, res) => {
    try {
        const { content, story } = req.body;

        if (!content || !story) {
            throw ("incorrect body");
        }

        //TODO: database query / haski api request

        res.status(200).send({
            message: `haski ausgabe!`
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})


const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server has started on port: ${port}!`);
});


// app.listen(port, () => console.log(`Server has started on port: ${port}!`));