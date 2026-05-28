```jsx
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
          points: 10,
          rank: "Bronze",
        },
      ]);

    if (error) {
      console.log(error);
      setError("Грешка при регистрация");
      return;
    }

    alert("Успешна регистрация!");
  }

  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.profileCard}>

          <h1 style={styles.logo}>
            VR ESCAPE
          </h1>

          <div style={styles.avatar}></div>

          <h2 style={styles.username}>
            {user.phone}
          </h2>

          <p style={styles.rank}>
            VOID WALKER
          </p>

          <div style={styles.pointsBox}>
            <p style={styles.pointsLabel}>
              ТОЧКИ
            </p>

            <h1 style={styles.points}>
              {user.points}
            </h1>
          </div>

          <div style={styles.questionCard}>
            <h2 style={styles.questionTitle}>
              ВЪПРОС НА ДЕНЯ
            </h2>

            <p style={styles.question}>
              Коя игра е най-продаваната в историята?
            </p>

            <button style={styles.answerButton}>
              GTA V
            </button>

            <button style={styles.answerButtonCorrect}>
              Minecraft
            </button>

            <button style={styles.answerButton}>
              Fortnite
            </button>

            <button style={styles.answerButton}>
              Roblox
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          VR ESCAPE
        </h1>

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
    fontFamily: "Arial",
  },

  card: {
    background: "#111c44",
    padding: 30,
    borderRadius: 30,
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxShadow: "0 0 40px #a020f0",
  },

  profileCard: {
    width: "100%",
    maxWidth: 450,
    background: "#111c44",
    borderRadius: 30,
    padding: 25,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxShadow: "0 0 40px #a020f0",
  },

  logo: {
    color: "#ff4dff",
    textAlign: "center",
    fontSize: 48,
    marginBottom: 10,
    textShadow: "0 0 20px #ff00ff",
  },

  title: {
    color: "#ff4dff",
    textAlign: "center",
    fontSize: 50,
    marginBottom: 10,
    textShadow: "0 0 20px #ff00ff",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #ff00ff, #00d9ff)",
    alignSelf: "center",
    boxShadow: "0 0 25px #ff00ff",
  },

  username: {
    color: "white",
    textAlign: "center",
    fontSize: 38,
    margin: 0,
  },

  rank: {
    color: "#ff00ff",
    textAlign: "center",
    fontSize: 24,
    marginTop: -10,
    fontWeight: "bold",
  },

  pointsBox: {
    background: "#1f2c5c",
    borderRadius: 25,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 0 20px #7b2cff",
  },

  pointsLabel: {
    color: "#00d9ff",
    fontSize: 22,
    marginBottom: 5,
  },

  points: {
    color: "white",
    fontSize: 60,
    margin: 0,
  },

  questionCard: {
    background: "#0d1435",
    borderRadius: 25,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  questionTitle: {
    color: "#ff6600",
    fontSize: 28,
    margin: 0,
  },

  question: {
    color: "white",
    fontSize: 24,
    lineHeight: 1.4,
  },

  answerButton: {
    padding: 18,
    borderRadius: 18,
    border: "2px solid #333",
    background: "#111",
    color: "white",
    fontSize: 22,
    cursor: "pointer",
  },

  answerButtonCorrect: {
    padding: 18,
    borderRadius: 18,
    border: "none",
    background:
      "linear-gradient(90deg, #ff00ff, #8a2cff)",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 20px #ff00ff",
  },

  input: {
    padding: 20,
    borderRadius: 20,
    border: "3px solid #3388ff",
    background: "black",
    color: "white",
    fontSize: 28,
    outline: "none",
  },

  button: {
    padding: 20,
    borderRadius: 20,
    border: "none",
    background:
      "linear-gradient(90deg, #ff00ff, #d94dff)",
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    cursor: "pointer",
  },

  registerButton: {
    padding: 20,
    borderRadius: 20,
    border: "none",
    background:
      "linear-gradient(90deg, #00d9ff, #11b8d8)",
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    textAlign: "center",
    fontSize: 28,
    marginTop: 10,
  },
};

export default App;
```
