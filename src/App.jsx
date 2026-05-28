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
  .eq("name", phone)
  .eq("pin", pin)
  .single();

    if (error) {
      setError("Server error");
      return;
    }

    if (!data ) 
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
      .eq("phone", phone);

    if (existingUser && existingUser.length > 0) {
      setError("Този телефон вече съществува");
      return;
    }

    const { error } = await supabase
      .from("clients")
      .insert([
        {
          phone,
          pin,
          points: 10,
        },
      ]);

    if (error) {
      setError("Грешка при регистрация");
      return;
    }

    alert("Успешна регистрация!");
  }

  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.topBar}>
          <h1 style={styles.logo}>VOID WALKER</h1>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.avatar}></div>

          <div>
            <h2 style={styles.username}>{user.phone}</h2>

            <p style={styles.rank}>
              🔮 VOID WALKER
            </p>

            <div style={styles.xpBar}>
              <div style={styles.xpFill}></div>
            </div>

            <p style={styles.points}>
              {user.points} точки
            </p>
          </div>
        </div>

        <div style={styles.questionCard}>
          <h2 style={styles.questionTitle}>
            🔥 ВЪПРОС НА ДЕНЯ
          </h2>

          <p style={styles.question}>
            Коя игра е най-продаваната?
          </p>

          <button style={styles.answerButton}>
            GTA V
          </button>

          <button style={styles.answerButtonActive}>
            Minecraft
          </button>

          <button style={styles.answerButton}>
            Fortnite
          </button>

          <button style={styles.answerButton}>
            Roblox
          </button>

          <button style={styles.bigButton}>
            ⚡ ОТГОВОРИ
          </button>
        </div>

        <div style={styles.bottomRow}>
          <div style={styles.smallCard}>
            <h3>🎁 DAILY BONUS</h3>

            <p>+15 точки</p>

            <button style={styles.claimButton}>
              ВЗЕМИ
            </button>
          </div>

          <div style={styles.smallCard}>
            <h3>🔥 STREAK</h3>

            <p>7 дни подред</p>

            <p>Следващ бонус +25</p>
          </div>
        </div>

        <div style={styles.leaderboard}>
          <h2>🏆 ТОП ИГРАЧИ</h2>

          <div style={styles.player}>
            <span>#1 VOID_MASTER</span>
            <span>2560</span>
          </div>

          <div style={styles.player}>
            <span>#2 CYBER_WOLF</span>
            <span>1890</span>
          </div>

          <div style={styles.player}>
            <span>#3 GLITCHER</span>
            <span>1420</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h1 style={styles.logo}>VR ESCAPE</h1>

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

        <button onClick={login} style={styles.loginButton}>
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
    background: "#020617",
    padding: 20,
    color: "white",
    fontFamily: "Arial",
  },

  topBar: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 42,
    color: "#d946ef",
    textShadow: "0 0 20px #d946ef",
  },

  loginCard: {
    background: "#111827",
    padding: 30,
    borderRadius: 25,
    maxWidth: 420,
    margin: "50px auto",
    display: "flex",
    flexDirection: "column",
    gap: 15,
    boxShadow: "0 0 30px #9333ea55",
  },

  input: {
    padding: 18,
    borderRadius: 18,
    border: "2px solid #3b82f6",
    background: "#000",
    color: "white",
    fontSize: 22,
  },

  loginButton: {
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "#d946ef",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  registerButton: {
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "#06b6d4",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  error: {
    color: "red",
    textAlign: "center",
    fontSize: 20,
  },

  profileCard: {
    background: "#111827",
    borderRadius: 25,
    padding: 20,
    display: "flex",
    gap: 20,
    alignItems: "center",
    marginBottom: 20,
    boxShadow: "0 0 20px #9333ea33",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#d946ef,#3b82f6)",
  },

  username: {
    fontSize: 34,
    margin: 0,
  },

  rank: {
    color: "#d946ef",
    fontSize: 20,
  },

  xpBar: {
    width: 220,
    height: 12,
    background: "#222",
    borderRadius: 20,
    overflow: "hidden",
  },

  xpFill: {
    width: "65%",
    height: "100%",
    background:
      "linear-gradient(90deg,#d946ef,#3b82f6)",
  },

  points: {
    marginTop: 10,
    fontSize: 22,
  },

  questionCard: {
    background: "#111827",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 0 20px #9333ea22",
  },

  questionTitle: {
    color: "#f97316",
    marginBottom: 15,
  },

  question: {
    fontSize: 28,
    marginBottom: 20,
  },

  answerButton: {
    width: "100%",
    padding: 18,
    marginBottom: 12,
    borderRadius: 16,
    border: "2px solid #333",
    background: "#0f172a",
    color: "white",
    fontSize: 22,
  },

  answerButtonActive: {
    width: "100%",
    padding: 18,
    marginBottom: 12,
    borderRadius: 16,
    border: "none",
    background:
      "linear-gradient(90deg,#d946ef,#9333ea)",
    color: "white",
    fontSize: 22,
  },

  bigButton: {
    width: "100%",
    padding: 20,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(90deg,#9333ea,#d946ef)",
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  bottomRow: {
    display: "flex",
    gap: 15,
    marginBottom: 20,
  },

  smallCard: {
    flex: 1,
    background: "#111827",
    padding: 20,
    borderRadius: 20,
    boxShadow: "0 0 20px #06b6d422",
  },

  claimButton: {
    marginTop: 10,
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontSize: 18,
  },

  leaderboard: {
    background: "#111827",
    borderRadius: 25,
    padding: 20,
    boxShadow: "0 0 20px #d946ef22",
  },

  player: {
    display: "flex",
    justifyContent: "space-between",
    padding: 15,
    borderBottom: "1px solid #222",
    fontSize: 20,
  },
};

export default App;