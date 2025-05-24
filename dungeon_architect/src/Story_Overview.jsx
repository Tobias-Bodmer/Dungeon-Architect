import React, { useState, useEffect } from "react";
import axios from 'axios';

const StoryOverview = ({ onToggle }) => {
    const [stories, setStories] = useState([]);

    useEffect(() => {

        axios.post('https://localhost:1337/stories', "", {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    setStories(response.data.stories);
                }
            })
            .catch(error => {
                if (error.status === 401) {
                    localStorage.setItem("isLoggedIn", false);
                    localStorage.setItem("story", '');
                    window.location.reload();
                }
                console.error("Fehler beim Laden der Stories:", error);
            });
    }, []);

    const handleClick = async (e) => {
        localStorage.setItem("story", e.currentTarget.id);
        onToggle();
    };
    //TODO: headline information verwenden!
    return (
        <div id="stories">
            {stories.map((story, index) => (
                <div id={index} key={index} onClick={handleClick}>
                    <h3>Story {index + 1} - {story.headline}</h3>
                    <p>{story.description}</p>
                </div>
            ))}
            <div id="new" onClick={handleClick}>
                <h3>Story erstellen?</h3>
                <p>Hier kannst du ein neuns Adventure beginnen!</p>
            </div>
        </div>
    );
};

export default StoryOverview;