import { useState } from "react";

function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      alert("Wpisz email i hasło. To tylko lokalny mock logowania.");
      return;
    }

    onLogin();
  }

  return (
    <div className="modal-overlay">
      <div className="login-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>
          X
        </button>

        <h2>{mode === "login" ? "Zaloguj się" : "Rejestracja"}</h2>

        <p className="muted">
          To lokalny mock logowania. Dane nie są wysyłane na serwer.
        </p>

        <label className="form-field">
          Email
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="form-field">
          Hasło
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button className="button-primary full-width" onClick={handleSubmit}>
          {mode === "login" ? "Zaloguj" : "Utwórz konto"}
        </button>

        <div className="modal-links">
          <button
            className="button-link"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Utwórz konto" : "Mam już konto"}
          </button>

          <button
            className="button-link"
            onClick={() => alert("Funkcja przypomnienia hasła jest mockowa.")}
          >
            Nie pamiętasz hasła?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
