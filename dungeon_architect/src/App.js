import React, { useState } from "react";
import LoginForm from "./Login";
import StoryEditor from "./Story_Editor";
import StoryOverview from "./Story_Overview";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import axios from 'axios';

export default function LandingPage() {
  const [show, toggleShow] = useState(false);

  async function toggle() {
    if (localStorage.getItem("isLoggedIn") === 'true' && localStorage.getItem("story") === "") {
      return;
    }

    toggleShow(preShow => !preShow);
  }

  async function logOut() {
    if (localStorage.getItem("isLoggedIn") === 'false') {
      return;
    }

    axios.post('https://localhost:1337/logout', "", {
      withCredentials: true
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("isLoggedIn", false)
          localStorage.setItem("story", '')
          window.location.reload();
        } 
      });
  }

  return (
    <>
      <div id='nav'>
        <button onClick={toggle}>
          <FontAwesomeIcon icon={faUser} />
        </button>
        {(localStorage.getItem("isLoggedIn") === 'true') ?
          <button onClick={logOut}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
          : ""}
      </div>
      {!(localStorage.getItem("isLoggedIn") === 'true') && show ? <LoginForm /> : ""}
      <div>
        <h1 className={`headline ${show || (localStorage.getItem("isLoggedIn") === 'true') ? "animate" : ""}`}>
          <span className="line1">Dungeon</span>{" "}
          <span className="line2">Architect</span>
        </h1>
      </div>
      <div>
        {(localStorage.getItem("isLoggedIn") === 'true') && !show ? <StoryOverview onToggle={toggle} /> : ""}
        {(localStorage.getItem("isLoggedIn") === 'true') && show ? <StoryEditor /> : ""}
      </div>
    </>
  );
}