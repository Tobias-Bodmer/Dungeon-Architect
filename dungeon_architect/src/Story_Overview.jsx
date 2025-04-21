import React, { useState, useEffect } from "react";
import axios from 'axios';

const StoryOverview = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const body = { mail: localStorage.getItem("loggedInUser") };

        axios.post('https://localhost:1337/stories', body, {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    setStories(response.data.stories);
                }
            })
            .catch(error => {
                console.error("Fehler beim Laden der Stories:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return "";

    return (
        <div id="stories">
            {stories.map((story, index) => (
                <div key={index}>
                    <h3>Story {index}</h3>
                    <p>{story.description}</p>
                </div>
            ))}
        </div>
    );
};

export default StoryOverview;