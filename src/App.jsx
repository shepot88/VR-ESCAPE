import { useState } from "react"
import { supabase } from "./supabase"

function App() {
  const [phone, setPhone] = useState("")
  const [client, setClient] = useState(null)
  const [leaders, setLeaders] = useState([])

  const loadLeaders = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("points", { ascending: false })
      .limit(10)

    setLeaders(data || [])
  }

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("phone", phone)
      .single()

    if (error || !data) {
      alert("Няма такъв клиент")
      return
    }

    const today = new Date().toISOString().split("T")[0]

    let newPoints = data.points
    let rank = data.rank

    // +20 само веднъж на ден
    if (data.last_visit !== today) {
      newPoints = data.points + 20

      if (newPoints >= 500) {
        rank = "Legend"
      } else if (newPoints >= 300) {
        rank = "Diamond"
      } else if (newPoints >= 200) {
        rank = "Gold"
      } else if (newPoints >= 100) {
        rank = "Silver"
      } else {
        rank = "Bronze"
      }

      await supabase
        .from("clients")
        .update({
          points: newPoints,
          last_visit: today,
          rank: rank,
        })
        .eq("id", data.id)
    }

    setClient({
      ...data,
      points: newPoints,
      rank: rank,
    })

    await loadLeaders()
  }

  if (client) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1>Здравей, {client.name}</h1>

          <h3>🏅 {client.rank}</h3>

          <h2>{client.points} точки</h2>

          <p>
            {client.points >= 500
              ? "👑 LEGEND PLAYER"
              : client.points >= 300
              ? "🎮 DIAMOND PLAYER"
              : client.points >= 200
              ? "🥇 GOLD PLAYER"
              : client.points >= 100
              ? "🥈 SILVER PLAYER"
              : `Още ${100 - client.points} точки до Silver`}
          </p>

          <button
            style={styles.button}
            onClick={() => {
              setClient(null)
              setPhone("")
            }}
          >
            Изход
          </button>

          <h3 style={{ marginTop: "30px" }}>
            🏆 ТОП ХЪНТЪРИ
          </h3>

          {leaders.map((player, index) => (
            <div
              key={player.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                background: "rgba(255,255,255,0.1)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <span>
                #{index + 1} {player.name}
              </span>

              <span>
                {player.points} т. • {player.rank}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>VR ESCAPE</h1>

        <input
          style={styles.input}
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
        >
          Вход
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: "#0f172a",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    textAlign: "center",
    color: "white",
    backdropFilter: "blur(10px)",
  },

  input: {
    width: "100%",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    background: "#c026d3",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },
}

export default App 