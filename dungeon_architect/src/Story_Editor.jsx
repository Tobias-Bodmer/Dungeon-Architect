import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const StoryEditor = () => {
    const [answer, setAnswer] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("story") === "new") {
            return;
        }


        axios.post('https://localhost:1337/stories', "", {
            withCredentials: true
        }).then(response => {
            if (response.status === 200) {
                const conversation = response.data.stories[localStorage.getItem("story")].conversationHistory;
                setAnswer(conversation);
            } else if (response.status === 401) {
                localStorage.setItem("isLoggedIn", false)
                localStorage.setItem("story", '')
                window.location.reload();
            }
        })

    }, []);

    const kiContentRef = useRef(null);

    useEffect(() => {
        if (!kiContentRef.current) return;

        const container = kiContentRef.current;
        const lastMessage = container.querySelector(".answers > div:last-child");

        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            container.scrollTop = container.scrollHeight;
        }
    }, [answer, isLoading]);


    const handleEnter = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content) {
            setError("Textfeld ist leer.");
            return;
        }

        try {
            setAnswer(prev => [...prev, { role: "user", content: content }]);

            const body = { advKey: localStorage.getItem("story"), message: content };

            setContent("");

            setIsLoading(true);

            const response = await axios.post('https://localhost:1337/haski', body, {
                withCredentials: true
            })

            if (response.status === 200) {
                if (localStorage.getItem("story") === "new") {
                    localStorage.setItem("story", (response.data.advKey - 1))
                }

                const aiLine = { role: 'assistant', content: `${response.data.answer}` };

                setAnswer(prev => [...prev, aiLine]);
            } else {
                setError("Unerwartete Antwort vom Server.");
            }
        } catch (err) {
            if (err.status === 401) {
                localStorage.setItem("isLoggedIn", false)
                localStorage.setItem("story", '')
                window.location.reload();
            }
            console.error("Fehler bei der Anfrage:", err);
            setError("Verbindung zum Server fehlgeschlagen.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div class="story-editor">
            <div id="ki-content" ref={kiContentRef}>
                {localStorage.getItem("story") === "new" && (
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
                        <div class={answer[index].role}>
                            <p key={index} class={answer[index].role}>
                                {answer[index].content.split('\n').map((line, i) => (
                                    <>
                                        {line}
                                        {i < answer[index].content.split('\n').length - 1 && <br />}
                                    </>
                                ))}
                            </p>
                        </div>
                    ))}
                </div>
                {isLoading && (
                    <div className="loading-indicator">
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </div>
                )}
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
                        onKeyDown={handleEnter}
                    />
                </div>

                <button type="submit" className="haski-button">
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </form>
        </div>
    );
};

export default StoryEditor;