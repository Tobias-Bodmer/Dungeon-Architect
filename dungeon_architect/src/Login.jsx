import React, { useState } from "react";
import axios from 'axios';

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regError, setRegError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      setLoginError("Bitte fülle alle Felder aus!");
      return;
    }

    const body = { mail: `${loginEmail}`, password: `${loginPassword}` };

    axios.post('https://localhost:1337/login', body, {
      withCredentials: true
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("isLoggedIn", true)
          localStorage.setItem("story", '')
          window.location.reload();
        }
      }).catch(error => {
        if (error.response) {
          setLoginError("E-Mail oder Passwort inkorrekt.");
        }
      });;
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!regEmail || !regPassword || !repPassword) {
      setRegError("Bitte fülle alle Felder aus!");
      return;
    }

    if (regPassword !== repPassword) {
      setRegError("Passworteingabe stimmt nicht überein!");
      return;
    }

    if (!passwordPattern.test(regPassword)) {
      setRegError("Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.");
      return;
    }

    const body = { mail: `${regEmail}`, password: `${regPassword}` };

    axios.post('https://localhost:1337/registrate', body, {
      withCredentials: true
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("isLoggedIn", true)
          localStorage.setItem("story", '')
          window.location.reload();
        }
      }).catch(error => {
        if (error.response) {
          setRegError(error.response.data.error);
        }
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLoginSubmit} className="login-form">
        {loginError && <p className="error-message">{loginError}</p>}

        <div className="input-group">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Gib deine E-Mail ein"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Gib dein Passwort ein"
            required />
        </div>

        <button type="submit" className="login-button">
          Einloggen
        </button>
      </form>
      <form onSubmit={handleRegSubmit} className="registration-form">
        {regError && <p className="error-message">{regError}</p>}

        <div className="input-group">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="Gib deine E-Mail ein"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Gib dein Passwort ein"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Das Passwort muss mindestens eine Zahl, einen großen Buchstaben, einen kleinen Buchstaben und mindestens acht Zeichen lang sein."
            required />
        </div>

        <div className="input-group">
          <label htmlFor="repeat-password">Passwort wiederholen</label>
          <input
            type="password"
            id="password"
            value={repPassword}
            onChange={(e) => setRepPassword(e.target.value)}
            placeholder="Wiederhole dein Passwort"
            required />
        </div>

        <button type="submit" className="registration-button">
          Registrieren
        </button>
      </form>
    </div>
  );
};

export default LoginForm;