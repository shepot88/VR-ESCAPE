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

  async function login() {
    setError("");

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone.trim())
      .eq("pin", pin.trim())
      .maybeSingle();

    if (error || !data) {
      setError("Грешен телефон или PIN");
      return;
    }

    const updatedPoints = data.points + 10;

    await supabase
      .from("clients")
      .update({
        points: updatedPoints,
      })
      .eq("id", data.id);

    setUser({
      ...data,
      points: updatedPoints,
    });
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
          points: 100,
          xp: 0,
          streak: 1,
          rank: "VOID WALKER",
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
    if (selected) return;

    setSelected(answer);

    let newXp = user.xp;
    let newPoints = user.points;

    if (answer === "Minecraft") {
      newXp += 50;
      newPoints += 25;

      alert("✅ Правилен отговор +50 XP");
    } else {
      alert("❌ Грешен отговор");
    }

    const { data, error } = await supabase
      .from("clients")
      .update({
        xp: newXp,
        points: newPoints,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (!error) {
      setUser(data);
    }
  }

  if (!user) {
    return (
      <div className="loginScreen">

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
            className="loginButton"
            onClick={register}
          >
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