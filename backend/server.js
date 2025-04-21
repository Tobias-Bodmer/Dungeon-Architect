const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const port = 1337;

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};

const app = express()
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

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
        await collection.insertOne({ email: `${mail}`, password: `${password}` }, () => {

        });


        res.status(200).send({
            message: `${mail} is now registrated!`
        });

    } catch (error) {
        if (error.code === 11000) { // Mongo Duplicate Key Error
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

        const user = await collection.findOne({ email: `${mail}` });

        if (!user.email) throw ("User not found!")
        if (user.password != password) throw ("Password incorrect!")

        res.status(200).send({
            message: `${mail} was successfully logged in!`
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})

app.post('/stories', async (req, res) => {
    try {
        const { mail } = req.body;

        if (!mail) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const user = await collection.findOne({ email: `${mail}` });

        if (!user.email) throw ("User not found!")

        console.log(user.stories)

        res.status(200).send({
            stories: user.stories
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

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server has started on port: ${port}!`);
});


// app.listen(port, () => console.log(`Server has started on port: ${port}!`));