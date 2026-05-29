import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  "https://aumoiucfasixxayevfsn.supabase.co",
  "sb_publishable_h2_46fvtul7b1HfhCO7KLA_p0nDclkX"
);

function App() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function login() {
    setError("");

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone.trim())
      .eq("pin", pin.trim())
      .maybeSingle();

    if (!data) {
      setError("Грешен телефон или PIN");
      return;
    }

    if (data.last_login !== today) {
      await supabase
        .from("clients")
        .update({
          points: (data.points || 0) + 50,
          xp: (data.xp || 0) + 50,
          streak: (data.streak || 0) + 1,
          last_login: today,
        })
        .eq("id", data.id);

      data.points += 50;
      data.xp += 50;
      data.streak += 1;
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

    const { error } = await supabase
      .from("clients")
      .insert([
        {
          name: phone,
          phone: phone,
          pin: pin,
          points: 0,
          xp: 0,
          streak: 0,
          rank: "VOID WALKER",
          answered_today: false,
        },
      ]);

    if (error) {
      setError("Грешка при регистрация");
      return;
    }

    login();
  }

  async function answerQuestion(answer) {
    if (user.answered_today) return;

    setSelected(answer);

    if (answer === "Minecraft") {
      const newXP = user.xp + 100;
      const newPoints = user.points + 100;

      await supabase
        .from("clients")
        .update({
          xp: newXP,
          points: newPoints,
          answered_today: true,
        })
        .eq("id", user.id);

      setUser({
        ...user,
        xp: newXP,
        points: newPoints,
        answered_today: true,
      });
    }
  }

  if (!user) {
    return (
      <div className="loginScreen">

        <div className="loginGlow"></div>

        <div className="loginBox">

          <h1 className="loginTitle">
            VR ESCAPE
          </h1>

          <input
            className="loginInput"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="loginInput"
            placeholder="PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          <button
            className="loginButton"
            onClick={login}
          >
            Вход
          </button>

          <button
            className="registerButton"
            onClick={register}
          >
            Регистрация
          </button>

          {error && (
            <p className="errorText">
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

        <div className="logo">
          VR ESCAPE
        </div>

        <div className="bell">
          🔔
        </div>

      </div>

      <div className="profileCard">

        <div className="avatar"></div>

        <div className="profileInfo">

          <h2>{user.phone}</h2>

          <div className="rank">
            {user.rank}
          </div>

          <div className="xpText">
            {user.xp} / 1800 XP
          </div>

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
              💎 {user.points}
            </div>

            <div className="statBox">
              🔥 {user.streak}
            </div>

          </div>

        </div>

      </div>

      <div className="questionCard">

        <div className="questionHeader">
          🔥 ВЪПРОС НА ДЕНЯ
        </div>

        <div className="questionText">
          Коя игра е най-продаваната?
        </div>

        <button
          className={`answer ${selected === "GTA V" ? "active" : ""}`}
          onClick={() => answerQuestion("GTA V")}
        >
          GTA V
        </button>

        <button
          className={`answer ${selected === "Minecraft" ? "active" : ""}`}
          onClick={() => answerQuestion("Minecraft")}
        >
          Minecraft
        </button>

        <button
          className={`answer ${selected === "Fortnite" ? "active" : ""}`}
          onClick={() => answerQuestion("Fortnite")}
        >
          Fortnite
        </button>

        <button
          className={`answer ${selected === "Roblox" ? "active" : ""}`}
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

    </div>
  );
}

export default App; 