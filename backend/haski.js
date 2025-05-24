const axios = require('axios');
const apiKey = 'REMOVED_KEY';
var url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

// async function callHaski(adventureKey, message) {
//     try {
//         var systemInstruction = 'Antworte immer auf deutsch. Du bist ein Assistent für D&D-Spielleitung und hilft eine komplette Geschichte zu formulieren.';

//         if (adventureKey == "new") {
//             systemInstruction = 'Antworte immer auf deutsch. Du bist ein Assistent für D&D-Spielleitung und hilft eine komplette Geschichte zu formulieren. Deine ausagbe soll in json sein und so aussehen result:{headline: "", description: "", message: ""}. Die description darf maximal 30 Wörter umfassen.';
//         }
//         const response = await axios.post(
//             url,
//             {
//                 model: 'gpt-3.5-turbo',
//                 messages: [
//                     { role: 'system', content: `${systemInstruction}` },
//                     { role: 'user', content: message }
//                 ],
//                 temperature: 0.7
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
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

// async function callGemini(adventureKey, message) {
//     try {
//         const systemInstruction = `Antworte immer auf Deutsch. Du bist ein Assistent für D&D-Spielleitung und hilfst, eine komplette Geschichte zu formulieren.${
//             adventureKey === "new"
//                 ? ' Deine Ausgabe soll im JSON-Format sein und so aussehen: result: {headline: "", description: "", message: ""}. Die description darf maximal 30 Wörter umfassen.'
//                 : ''
//         }`;

//         const response = await axios.post(
//             'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
//             {
//                 contents: [
//                     {
//                         role: "user",
//                         parts: [{ text: `${systemInstruction}\n\n${message}` }]
//                     }
//                 ]
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${apiKey}`
//                 }
//             }
//         );

//         const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
//         console.log(reply);
//         return reply;
//     } catch (error) {
//         console.error('Fehler beim Aufruf der Gemini-API:', error.response?.data || error.message);
//         return error.response?.data || error.message;
//     }
// }

async function callGemini(adventureKey, message, conversationHistory) {
    try {
        const systemInstruction = `Antworte immer auf Deutsch. Du unterstützt den Benutzer beim Schreiben eines spannenden Dungeons & Dragons-Abenteuers. Deine Aufgabe ist es, gemeinsam mit ihm eine gut strukturierte, kreative und spielfertige Geschichte zu entwickeln, die später mit einer Spielergruppe verwendet werden kann.

                Du entwickelst eigenständig Orte, Charaktere, Konflikte und Ereignisse und beschreibst sie lebendig, aber präzise. Du sprichst **nicht den Spieler an**, sondern hilfst beim Entwurf der Geschichte. Die Handlung entsteht abschnittsweise und soll sich später für ein interaktives Spiel eignen. Wiederhole dich nicht, verwende eine bildhafte Sprache und denke vorausschauend, damit sich die Handlung logisch entfaltet.

                Wenn der Benutzer dir Fragen zu bereits erwähnten Details stellt (z. B. zu Namen, Orten oder Ereignissen), dann beantworte diese direkt, klar und knapp, ohne die restliche Geschichte erneut zu analysieren oder zu wiederholen. Nutze dafür den bisherigen Konversationsverlauf als Gedächtnis.

                Im Konversationsverlauf wirst du als **assistant** angesprochen. Antworte stets im Rahmen deiner Rolle als Schreib-Assistent und nicht als Spielfigur oder Erzähler. Vermeide es, die Kontrolle über die Geschichte an dich zu reißen.

                ${adventureKey === "new"
                ? `Deine erste Ausgabe soll genau so aussehen nicht mehr und nicht weniger: {"headline": "", "description": "", "message": ""}. "headline" ist ein spannender Titel, "description" ist eine Zusammenfassung der Ausgangssituation in maximal 100 Wörtern. "message" hier kommt die Geschichte maximal 1000 Wörter.`
                : ``}`;


        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-12b-it:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: `SYSTEMANWEISUNG:${systemInstruction}\n\nKONVERSATIONSVERLAUF:${conversationHistory}\n\nBENUTZEREINGABE:${message}` }]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = String(response.data.candidates?.[0]?.content?.parts?.[0]?.text);
        return reply;
    } catch (error) {
        console.error('Fehler beim Aufruf der Gemini-API:', error.response?.data || error.message);
        return error.response?.data || error.message;
    }
}

//Komprimiere die folgende Konversation zu einem sehr kompakten, maschinenlesbaren Gedächtnis-Snippet. Nutze Listen, Kürzel, Schlüsselbegriffe. Keine unnötigen Details. Maximal 300 Tokens.

// async function callHaski(adventureKey, message) {
//     try {
//         var systemInstruction = 'Antworte immer auf deutsch. Du bist ein Assistent für D&D-Spielleitung und hilft eine komplette Geschichte zu formulieren.';

//         if (adventureKey == "new") {
//             systemInstruction = 'Antworte immer auf deutsch. Du bist ein Assistent für D&D-Spielleitung und hilft eine komplette Geschichte zu formulieren. Deine ausagbe soll in json sein und so aussehen result:{headline: "", description: "", message: ""}. Die description darf maximal 30 Wörter umfassen.';
//         }

//         //TODO: alter content mitsenden
//         const response = await axios.post(
//             'http://localhost:11434/api/chat',
//             {
//                 model: 'gemma3:1b', 
//                 messages: [
//                     { role: 'system', content: `${systemInstruction}` },
//                     { role: 'user', content: message }
//                 ],
//                 stream: false
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );

//         console.log("Haski hat geantwortet!");
//         return response.data.message.content
//     } catch (error) {
//         console.error('Fehler beim Aufruf der API:', error.response?.data || error.message);
//         return error.response?.data || error.message;
//     }
// }

module.exports = callGemini;