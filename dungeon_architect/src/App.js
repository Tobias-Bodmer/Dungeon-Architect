import React, { useState } from "react";
import LoginForm from "./Login";
import StoryEditor from "./Story_Editor";
import StoryOverview from "./Story_Overview";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css';

export default function LandingPage() {
  const [show, toggleShow] = useState(false);

  function toggle() {
    toggleShow((show) => !show);
    console.log(localStorage.getItem("isLoggedIn") === 'true');
  }

  return (
    <>
      <div id='nav'>
        <button onClick={toggle}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
      {!(localStorage.getItem("isLoggedIn") == 'true') && show ? <LoginForm /> : ""}
      <div>
        <h1 className={`headline ${show || (localStorage.getItem("isLoggedIn") == 'true') ? "animate" : ""}`}>
          <span className="line1">Dungeon</span>{" "}
          <span className="line2">Architect</span>
        </h1>
      </div>
      <div>
        {(localStorage.getItem("isLoggedIn") == 'true') && !show ? <StoryEditor /> : ""}
        {(localStorage.getItem("isLoggedIn") == 'true') && show ? <StoryOverview /> : ""}

      </div>
    </>
  );
}