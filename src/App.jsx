import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  "https://aumoiucfasixxayevfsn.supabase.co",
  "ТУК_СЛОЖИ_ТВОЯ_SUPABASE_ANON_KEY"
);

function App() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const [registerMode, setRegisterMode] = useState(false);

  const today = new Date().toISOString().split("T")[0];

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

    // бонус само веднъж на ден
    if (data.last_login !== today) {

      const updatedPoints = data.points + 50;
      const updatedXp = data.xp + 50;
      const updatedStreak = data.streak + 1;

      await supabase
        .from("clients")
        .update({
          points: updatedPoints,
          xp: updatedXp,
          streak: updatedStreak,
          last_login: today,
          answered_today: false
        })
        .eq("phone", data.phone);

      data.points = updatedPoints;
      data.xp = updatedXp;
      data.streak = updatedStreak;
      data.last_login = today;
      data.answered_today = false;
    }

    setUser(data);
  }

  async function register() {

    if (!name || !phone || !pin) {
      setError("Попълни всичко");
      return;
    }

    const { data: existing } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone.trim())
      .maybeSingle();

    if (existing) {
      setError("Този телефон вече съществува");
      return;
    }

    const newUser = {
      name,
      phone,
      pin,
      points: 0,
      xp: 0,
      streak: 0,
      rank: "VOID WALKER",
      last_login: today,
      answered_today: false
    };

    const { error } = await supabase
      .from("clients")
      .insert([newUser]);

    if (error) {
      setError("Грешка при регистрация");
      return;
    }

    setRegisterMode(false);
    setError("");
  }

  async function answerQuestion(answer) {

    if (user.answered_today) return;

    setSelected(answer);

    if (answer === "GTA V") {

      const newPoints = user.points + 100;
      const newXp = user.xp + 100;

      await supabase
        .from("clients")
        .update({
          points: newPoints,
          xp: newXp,
          answered_today: true
        })
        .eq("phone", user.phone);

      setUser({
        ...user,
        points: newPoints,
        xp: newXp,
        answered_today: true
      });
    }
  }

  // LOGIN SCREEN
  if (!user) {

    return (
      <div className="loginScreen">

        <div className="loginBox">

          <h1 className="loginTitle">
            VR ESCAPE
          </h1>

          {registerMode && (
            <input
              className="loginInput"
              placeholder="Име"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

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

          {!registerMode ? (
            <>
              <button
                className="loginButton"
                onClick={login}
              >
                Вход
              </button>

              <button
                className="loginButton"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: "none"
                }}
                onClick={() => setRegisterMode(true)}
              >
                Регистрация
              </button>
            </>
          ) : (
            <>
              <button
                className="loginButton"
                onClick={register}
              >
                Създай профил
              </button>

              <button
                className="loginButton"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  boxShadow: "none"
                }}
                onClick={() => setRegisterMode(false)}
              >
                Назад
              </button>
            </>
          )}

          {error && (
            <p
              style={{
                color: "#ff4d4d",
                textAlign: "center",
                marginTop: "10px"
              }}
            >
              {error}
            </p>
          )}

        </div>
      </div>
    );
  }

  // APP
  return (
    <div className="app">

      <div className="topBar">

        <h1>SESSIONS</h1>

        <div className="bell">
          🔔
        </div>

      </div>

      <div className="profileCard">

        <div className="avatar"></div>

        <div className="profileInfo">

          <h2>{user.name}</h2>

          <div className="rank">
            {user.rank}
          </div>

          <div className="xp">
            {user.xp} XP
          </div>

          <div className="xpBar">
            <div
              className="xpFill"
              style={{
                width: `${Math.min((user.xp / 1800) * 100, 100)}%`
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
          className={`answer ${selected === "Minecraft" ? "active" : ""}`}
          onClick={() => answerQuestion("Minecraft")}
        >
          Minecraft
        </button>

        <button
          className={`answer ${selected === "GTA V" ? "active" : ""}`}
          onClick={() => answerQuestion("GTA V")}
        >
          GTA V
        </button>

        <button
          className={`answer ${selected === "Fortnite" ? "active" : ""}`}
          onClick={() => answerQuestion("Fortnite")}
        >
          Fortnite
        </button>

      </div>

      <div className="bottomNav">

        <div className="navItem activeNav">
          🏆
        </div>

        <div className="navItem">
          🎁
        </div>

        <div className="scanButton">
          ⌘
        </div>

        <div className="navItem">
          🎮
        </div>

        <div className="navItem">
          👤
        </div>

      </div>

    </div>
  );
}

export default App;