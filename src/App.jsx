import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://aumoiucfasixxayevfsn.supabase.co",
  "sb_publishable_h2_46fvtul7b1HfhCO7KLA_p0nDclkXgi"
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
      .eq("phone", phone)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      setError("Грешен телефон или PIN");
      return;
    }

    setUser(data);
  }

  async function register() {
    setError("");

    const { data: existingUser } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone)
      .single();

    if (existingUser) {
      setError("Този телефон вече съществува");
      return;
    }

    const { error } = await supabase
      .from("clients")
      .insert([
        {
          phone: phone,
          pin: pin,
          points: 0,
        },
      ]);

    if (error) {
      setError("Грешка при регистрация");
      return;
    }

    alert("Успешна регистрация!");
  }

  if (user) {
    const level =
      user.points >= 1000
        ? "VOID WALKER"
        : user.points >= 500
        ? "PHANTOM"
        : user.points >= 250
        ? "RAIDER"
        : "ROOKIE";

    const progress = (user.points % 250) / 2.5;

    return (
      <div style={styles.gameContainer}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            👾
          </div>

          <h1 style={styles.username}>
            {user.phone}
          </h1>

          <div style={styles.rank}>
            {level}
          </div>

          <div style={styles.pointsBox}>
            ⚡ {user.points} XP
          </div>

          <div style={styles.xpBarBackground}>
            <div
              style={{
                ...styles.xpBarFill,
                width: `${progress}%`,
              }}
            />
          </div>

          <button style={styles.dailyButton}>
            🎁 DAILY REWARD
          </button>

          <div style={styles.menuGrid}>
            <div style={styles.menuCard}>
              🏆
              <span>Leaderboard</span>
            </div>

            <div style={styles.menuCard}>
              ❓
              <span>Question</span>
            </div>

            <div style={styles.menuCard}>
              🎮
              <span>Missions</span>
            </div>

            <div style={styles.menuCard}>
              🎁
              <span>Rewards</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>VR ESCAPE</h1>

        <input
          type="text"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.button}>
          Вход
        </button>

        <button onClick={register} style={styles.registerButton}>
          Регистрация
        </button>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#020b2c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    background: "#1d2948",
    padding: 30,
    borderRadius: 25,
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    boxShadow: "0 0 40px #ff00ff33",
  },

  title: {
    color: "white",
    textAlign: "center",
    fontSize: 50,
    marginBottom: 10,
  },

  text: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
  },

  input: {
    padding: 18,
    borderRadius: 18,
    border: "3px solid #4d8dff",
    background: "black",
    color: "white",
    fontSize: 24,
    outline: "none",
  },

  button: {
    padding: 18,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(90deg,#ff00ff,#6a00ff)",
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    cursor: "pointer",
  },

  registerButton: {
    padding: 18,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(90deg,#00e5ff,#0066ff)",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    textAlign: "center",
    fontSize: 24,
    marginTop: 10,
  },

  gameContainer: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg,#050816,#0b1023,#14002d)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  profileCard: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 30,
    padding: 30,
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 40px #ff00ff55",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#ff00ff,#6a00ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 50,
    marginBottom: 20,
  },

  username: {
    color: "white",
    fontSize: 28,
    margin: 0,
  },

  rank: {
    color: "#00e5ff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    letterSpacing: 2,
  },

  pointsBox: {
    marginTop: 20,
    background: "#111827",
    padding: "14px 25px",
    borderRadius: 20,
    color: "#00ffcc",
    fontSize: 24,
    fontWeight: "bold",
  },

  xpBarBackground: {
    width: "100%",
    height: 18,
    background: "#1f2937",
    borderRadius: 999,
    marginTop: 25,
    overflow: "hidden",
  },

  xpBarFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#00e5ff,#ff00ff)",
    borderRadius: 999,
  },

  dailyButton: {
    marginTop: 25,
    width: "100%",
    padding: 18,
    border: "none",
    borderRadius: 18,
    background:
      "linear-gradient(90deg,#ff00ff,#6a00ff)",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 25px #ff00ff88",
  },

  menuGrid: {
    marginTop: 30,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15,
  },

  menuCard: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 25,
    color: "white",
    fontSize: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 0 20px #00e5ff22",
  },
};

export default App;