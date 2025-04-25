const axios = require('axios');
const apiKey = '';
var url = "https://api.openai.com/v1/chat/completions";

// async function callHaski(adventureKey, message) {
//     try {
//         const response = await axios.post(
//             url,
//             {
//                 model: 'gpt-3.5-turbo',
//                 messages: [
//                     { role: 'system', content: 'Du bist ein Assistent für D&D-Spielleitung. Komprimiere die folgende Konversation zu einem sehr kompakten, maschinenlesbaren Gedächtnis-Snippet. Nutze Listen, Kürzel, Schlüsselbegriffe. Keine unnötigen Details. Maximal 300 Tokens.' },
//                     { role: 'user', content: message }
//                 ],
//                 temperature: 0.7
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${apiKey}`
//                 }
//             }
//         );

//         console.log(response.data.choices[0].message.content);
//         return response.data.choices[0].message.content
//     } catch (error) {
//         console.error('Fehler beim Aufruf der API:', error.response?.data || error.message);
//         return error.response?.data || error.message;
//     }
// }

//Komprimiere die folgende Konversation zu einem sehr kompakten, maschinenlesbaren Gedächtnis-Snippet. Nutze Listen, Kürzel, Schlüsselbegriffe. Keine unnötigen Details. Maximal 300 Tokens.

async function callHaski(adventureKey, message) {
    try {
        const response = await axios.post(
            'http://localhost:11434/api/chat',
            {
                model: 'mistral', 
                messages: [
                    { role: 'system', content: 'Antworte immer auf deutsch. Du bist ein Assistent für D&D-Spielleitung.' },
                    { role: 'user', content: message }
                ],
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("Haski hat geantwortet!");
        return response.data.message.content
    } catch (error) {
        console.error('Fehler beim Aufruf der API:', error.response?.data || error.message);
        return error.response?.data || error.message;
    }
}

module.exports = callHaski;