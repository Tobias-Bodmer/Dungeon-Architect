const fs = require('fs');
const https = require('https');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');
const callHaski = require('./haski');
const callGemini = require('./haski');
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

app.use(session({
    secret: 'dein-geheimnis',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.post('/registrate', async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            return res.status(400).send({ error: "Incorrect body" });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ email: mail });
        if (existingUser) {
            return res.status(409).json({ error: "Benutzer existiert bereits" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await collection.insertOne({
            email: mail,
            password: hashedPassword,
            stories: []
        });

        res.status(200).send({
            message: `${mail} is now registered!`,
            user: req.session.user
        });

    } catch (error) {
        console.error("Fehler bei Registrierung:", error);
        res.status(500).send({ error: `${error}` });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            return res.status(400).send({ error: "Missing mail or password." });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const user = await collection.findOne({ email: mail });

        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ error: "Password incorrect!" });
        }

        req.session.user = {
            id: user._id,
            email: user.email
        };

        res.status(200).send({
            message: `${mail} was successfully logged in!`,
            user: req.session.user
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ error: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.send({ message: "Logged out" });
    });
});

app.get('/session', (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ error: 'Not logged in' });
    }
    res.send({ user: req.session.user });
});

app.post('/stories', requireLogin, async (req, res) => {
    try {
        const userEmail = req.session.user.email;

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const user = await collection.findOne({ email: `${userEmail}` });

        if (!user.email) throw ("User not found!")

        res.status(200).send({
            stories: user.stories
        });

    } catch (error) {
        res.status(500).send({
            error: `${error}`
        });
    }
})


app.post('/haski', requireLogin, async (req, res) => {
    try {
        const { advKey, message } = req.body;

        const userEmail = req.session.user.email;

        if (!advKey || !message) {
            throw ("incorrect body");
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const user = await collection.findOne({ email: userEmail });
        const conversationHistory = user?.stories?.[advKey]?.conversationHistory || [];

        var conversation = "";

        conversationHistory.forEach(element => {
            conversation += `${element.role}: ${element.content}\n\n`;
        });

        // var result = await callHaski(advKey, message);
        var result = await callGemini(advKey, message, conversation);


        if (advKey == "new") {
            const cleaned = cleanJsonResponse(result);
            result = JSON.parse(cleaned);
            console.log(result);
            collection.updateOne({ email: `${userEmail}` }, {
                $push: {
                    stories: {
                        headline: `${result.headline}`, description: `${result.description}`, conversationHistory: [
                            { role: 'user', content: `${message}` },
                            { role: 'assistant', content: `${result.message}` }
                        ]
                    }
                }
            });
            result = result.message;
        } else {
            collection.updateOne({ email: `${userEmail}` }, {
                $push: {
                    [`stories.${advKey}.conversationHistory`]: {
                        $each: [
                            { role: 'user', content: `${message}` },
                            { role: 'assistant', content: `${result}` }
                        ]
                    }
                }
            })
        }

        res.status(200).send({
            answer: result,
            advKey: user.stories.length
        });

    } catch (error) {
        console.error(error);

        res.status(500).send({
            error: `${error}`
        });
    }
})

function cleanJsonResponse(rawResponse) {
    let cleaned = rawResponse
        .replace(/^```json\s*/, '')
        .replace(/```$/, '')
        .trim();

    cleaned = cleaned.replace(/\r?\n/g, '\\n');

    return cleaned;
}


function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({ error: "Not authenticated" });
    }
    req.session.touch();

    next();
}

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server has started on port: ${port}!`);
});


// app.listen(port, () => console.log(`Server has started on port: ${port}!`));