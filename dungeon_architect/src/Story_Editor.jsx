import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const StoryEditor = () => {
    const [answer, setAnswer] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content) {
            setError("Textfeld ist leer.");
            return;
        }

        setError("");

        try {
            const body = { advKey: "123", message: content };

            const response = await axios.post('https://localhost:1337/haski', body, {
                withCredentials: true
            })

            if (response.status === 200) {
                console.log(response.data.answer);
                setAnswer(prev => [...prev, response.data.answer]);
            } else {
                setError("Unerwartete Antwort vom Server.");
            }
        } catch (err) {
            console.error("Fehler bei der Anfrage:", err);
            setError("Verbindung zum Server fehlgeschlagen.");
        }
    };

    return (
        <>
            <div id="ki-content">
                {localStorage.getItem("story") == "new" && (
                    <>
                        Um eine Geschichte zu erstellen, gib mir folgende Hinweise zu deiner Geschichte:<br />
                        <p>
                            - Setting: Welt oder Region (z.B. Mittelerde, Westeros, Verne)<br />
                            - Hauptquest: Ziel oder Aufgabe des Helden<br />
                            - Nebenplots oder Seitenquests: Nebenschlüssel zum Hauptquest, unabhängige Erzählungen oder Ereignisse<br />
                            - Charaktere: NPC (Nicht-Spieler-Charaktere) und Monster mit Beschreibung und Motivation<br />
                            - Schlüsselpunkte der Geschichte: Ereignisse, die wichtig für die Entwicklung der Handlung sind<br />
                            - Regeln und Settings: Regeln für Kampf, Magie, Umwelt etc., die bei deiner Geschichte gelten<br />
                        </p>
                        Weitere Details:<br />
                        <p>
                            - Länge der Abenteuer: Mehrere Sitzungen oder One-Shot (Einzelspiel)<br />
                            - Schwierigkeitsgrad: Leicht, Mittelschwer, Schwer oder Benutzerdefiniert<br />
                            - Stimmung: Leichtmütige, dunkle, mystische usw.<br />
                            - Charakterlevels: Startniveau und möglicher Fortschritt<br />
                        </p>
                    </>
                )}
                <div className="answers">
                    {answer.map((a, index) => (
                        <p key={index}>
                            {a.split('\n').map((line, i) => (
                                <>
                                    {line}
                                    {i < a.split('\n').length - 1 && <br />}
                                </>
                            ))}
                        </p>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit} className="haski-form">
                {error && <p className="error-message">{error}</p>}

                <div className="input-group">
                    <textarea
                        id="text"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Frag Haski"
                        required
                    />
                </div>

                <button type="submit" className="haski-button">
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </form>
        </>
    );
};

export default StoryEditor;