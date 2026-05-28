import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabase = createClient(
  "https://aumoiucfasixxayevfsn.supabase.co",
  "ТУК_СЛОЖИ_PUBLISHABLE_KEY"
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
      setError("Този телефон вече съществува");
      return;
    }

    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          phone: phone.trim(),
          pin: pin.trim(),
          points: 0,
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

          <button onClick={login}>Вход</button>
          <button onClick={register}>Регистрация</button>

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="topBar">
        <h1>VR ESCAPE</h1>
      </div>

      <div className="profileCard">
        <div className="avatar"></div>

        <div>
          <h2>{user.phone}</h2>
          <p>{user.rank}</p>

          <div className="xpBar">
            <div className="xpFill"></div>
          </div>
        </div>
      </div>

      <div className="questionCard">
        <h3>🔥 ВЪПРОС НА ДЕНЯ</h3>

        <h2>Коя игра е най-продаваната?</h2>

        <button>GTA V</button>
        <button className="active">Minecraft</button>
        <button>Fortnite</button>
        <button>Roblox</button>
      </div>

      <div className="bottomNav">
        <div>🏠</div>
        <div>🏆</div>
        <div className="centerBtn">⌘</div>
        <div>🎁</div>
        <div>👤</div>
      </div>
    </div>
  );
}

export default App;