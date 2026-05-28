import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [player, setPlayer] = useState(null);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("points", { ascending: false });

    setLeaders(data || []);
  }

  async function login() {
    if (!phone || !pin) {
      alert("Въведи телефон и PIN");
      return;
    }

    const { data: existing } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone)
      .single();

    if (!existing) {
      const { data } = await supabase
        .from("clients")
        .insert([
          {
            phone,
            pin,
            name: "Играч",
            points: 0,
          },
        ])
        .select()
        .single();

      setPlayer(data);
      loadLeaderboard();
      return;
    }

    if (existing.pin !== pin) {
      alert("Грешен PIN");
      return;
    }

    setPlayer(existing);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>VR ESCAPE</h1>

        {!player ? (
          <>
            <input
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="PIN"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={styles.input}
            />

            <button onClick={login} style={styles.button}>
              Вход / Регистрация
            </button>
          </>
        ) : (
          <>
            <h2>{player.name}</h2>

            <div style={styles.points}>
              Точки: {player.points}
            </div>
          </>
        )}
      </div>

      <div style={styles.leaderboard}>
        <h2>Класация</h2>

        {leaders.map((player, index) => (
          <div key={player.id} style={styles.row}>
            <span>
              #{index + 1} {player.name}
            </span>

            <span>
              {player.points} т.
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#050510",
    minHeight: "100vh",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 0 30px #ff00ff55",
  },

  title: {
    textAlign: "center",
    color: "#ff00ff",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#ff00ff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  points: {
    fontSize: "24px",
    textAlign: "center",
  },

  leaderboard: {
    marginTop: "30px",
    width: "320px",
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    background: "rgba(255,255,255,0.08)",
    marginTop: "10px",
    borderRadius: "10px",
  },
};

export default App;