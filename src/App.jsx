import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "ТУК_СЛОЖИ_SUPABASE_URL",
  "ТУК_СЛОЖИ_SUPABASE_ANON_KEY"
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

  if (user) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1>Добре дошъл</h1>

          <h2>{user.name}</h2>

          <p>Точки: {user.points}</p>

          <p>
            Последно посещение:{" "}
            {user.last_visit_date || "няма"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
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
  page: {
    minHeight: "100vh",
    background: "#071133",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    background: "#1e2945",
    padding: "30px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },

  title: {
    color: "white",
    fontSize: "48px",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "16px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "2px solid #4c8bf5",
    background: "black",
    color: "white",
    fontSize: "20px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "#d624ff",
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: "15px",
  },
};

export default App;