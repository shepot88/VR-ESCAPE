import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://aumoiucfasixxayevfsn.supabase.co",
  "sb_publishable_h2_46fvtul7b1HfhCO7KLA_p0nDclkX"
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
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Добре дошъл</h1>

          <p style={styles.text}>
            Телефон: {user.phone}
          </p>

          <p style={styles.text}>
            Точки: {user.points}
          </p>
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
    background: "#d72cff",
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    cursor: "pointer",
  },

  registerButton: {
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "#4d8dff",
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
};

export default App;