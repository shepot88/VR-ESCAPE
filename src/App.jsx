```jsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  "https://aumoiucfasixxayevfsn.supabase.co",
  "sb_publishable_h2_46fvtul7b1hFhCO7KLA_p0nDclkx"
);

function App() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  async function login() {
    setError("");

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone.trim())
      .eq("pin", pin.trim())
      .maybeSingle();

    if (error) {
      setError(error.message);
      return;
    }

    if (!data) {
      setError("Грешен телефон или PIN");
      return;
    }

    setUser(data);
  }

  async function register() {
    setError("");

    const { data: existing } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone.trim())
      .maybeSingle();

    if (existing) {
      setError("Телефонът вече съществува");
      return;
    }

    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          phone: phone.trim(),
          pin: pin.trim(),
          points: 500,
          xp: 0,
          streak: 0,
          answered_today: false,
          rank: "Bronze",
        },
      ])
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setUser(data);
  }

  async function answerQuestion(answer) {
    if (user.answered_today) {
      setError("Вече отговори днес");
      return;
    }

    let newPoints = user.points;
    let newXp = user.xp;

    if (answer === "Minecraft") {
      newPoints += 50;
      newXp += 150;
    }

    const { data, error } = await supabase
      .from("clients")
      .update({
        points: newPoints,
        xp: newXp,
        answered_today: true,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setUser(data);
  }

  if (!user) {
    return (
      <div className="loginPage">
        <div className="loginCard">
          <h1>VR ESCAPE</h1>

          <input
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button onClick={login}>
            Вход
          </button>

          <button onClick={register}>
            Регистрация
          </button>

          {error && (
            <p className="error">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <div className="topBar">
        <h1>VR ESCAPE</h1>

        <div className="bell">
          🔔
        </div>
      </div>

      <div className="profileCard">

        <div className="avatar"></div>

        <div className="profileInfo">

          <h2>{user.phone}</h2>

          <p className="rank">
            {user.rank}
          </p>

          <p className="xp">
            {user.xp} / 1800 XP
          </p>

          <div className="xpBar">
            <div
              className="xpFill"
              style={{
                width: `${(user.xp / 1800) * 100}%`,
              }}
            ></div>
          </div>

          <div className="stats">

            <div className="statBox">
              🔥 {user.streak} дни
            </div>

            <div className="statBox">
              💎 {user.points} точки
            </div>

          </div>

        </div>

      </div>

      <div className="questionCard">

        <h3>
          🔥 ВЪПРОС НА ДЕНЯ
        </h3>

        <h2>
          Коя игра е най-продаваната?
        </h2>

        <button
          className="answer"
          onClick={() => answerQuestion("GTA V")}
        >
          GTA V
        </button>

        <button
          className="answer active"
          onClick={() => answerQuestion("Minecraft")}
        >
          Minecraft
        </button>

        <button
          className="answer"
          onClick={() => answerQuestion("Fortnite")}
        >
          Fortnite
        </button>

        <button
          className="answer"
          onClick={() => answerQuestion("Roblox")}
        >
          Roblox
        </button>

      </div>

      <div className="bottomNav">

        <div className="navItem activeNav">
          🏠
        </div>

        <div className="navItem">
          🏆
        </div>

        <div className="scanButton">
          ⌘
        </div>

        <div className="navItem">
          🎁
        </div>

        <div className="navItem">
          👤
        </div>

      </div>

      {error && (
        <p className="error bottomError">
          {error}
        </p>
      )}

    </div>
  );
}

export default App;
```
