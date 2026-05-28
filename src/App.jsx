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
          rank: "Bronze",
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
        <div style={styles.card}>
          <h1 style={styles.title}>VOID WALKER</h1>

          <p style={styles.text}>
            Потребител: {user.phone}
          </p>

          <p style={styles.points}>
            {user.points} ТОЧКИ
          </p>

          <p style={styles.rank}>
            Ранг: {user.rank}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
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
    background: "#0b1229",
    padding: 30,
    borderRadius: 30,
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxShadow: "0 0 40px #8f00ff",
  },

  logo: {
    color: "#ff38ff",
    textAlign: "center",
    fontSize: 52,
    fontWeight: "bold",
    textShadow: "0 0 20px #ff00ff",
  },

  title: {
    color: "#bb00ff",
    textAlign: "center",
    fontSize: 50,
    textShadow: "0 0 20px #bb00ff",
  },

  text: {
    color: "white",
    fontSize: 28,
    textAlign: "center",
  },

  points: {
    color: "#00e1ff",
    fontSize: 42,
    textAlign: "center",
    fontWeight: "bold",
  },

  rank: {
    color: "#ff38ff",
    fontSize: 26,
    textAlign: "center",
  },

  input: {
    padding: 20,
    borderRadius: 22,
    border: "3px solid #008cff",
    background: "black",
    color: "white",
    fontSize: 28,
    outline: "none",
  },

  button: {
    padding: 20,
    borderRadius: 22,
    border: "none",
    background: "linear-gradient(90deg,#ff00ff,#bb38ff)",
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    cursor: "pointer",
  },

  registerButton: {
    padding: 20,
    borderRadius: 22,
    border: "none",
    background: "linear-gradient(90deg,#00d9ff,#11b8d8)",
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    textAlign: "center",
    fontSize: 28,
  },
};

export default App;