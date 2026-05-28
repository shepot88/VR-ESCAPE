import "./App.css";
import {
  FaGift,
  FaFire,
  FaTrophy,
  FaBell,
  FaHome,
  FaQrcode,
  FaUser,
} from "react-icons/fa";

function App() {
  return (
    <div className="app">

      <div className="topbar">
        <h1>VR ESCAPE</h1>

        <div className="bell">
          <FaBell />
        </div>
      </div>

      <div className="profile-card">
        <div className="avatar"></div>

        <div className="profile-info">
          <h2>SHEPOT</h2>

          <p className="rank">VOID WALKER</p>

          <div className="xp-row">
            <span>1250 / 1800 XP</span>

            <div className="xp-bar">
              <div className="xp-fill"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">

        <div className="card question-card">
          <div className="card-title">
            <FaFire />
            <span>ВЪПРОС НА ДЕНЯ</span>
          </div>

          <h3>Коя игра е най-продаваната?</h3>

          <button className="answer">GTA V</button>
          <button className="answer active">Minecraft</button>
          <button className="answer">Fortnite</button>
          <button className="answer">Roblox</button>

          <button className="main-btn">
            ОТГОВОРИ
          </button>
        </div>

        <div className="card points-card">
          <h2>1250</h2>
          <p>ТОЧКИ</p>
        </div>

        <div className="card rank-card">
          <h2>VOID WALKER</h2>

          <div className="rank-image"></div>

          <p>Елитният ранг на VR ESCAPE</p>
        </div>

        <div className="card bonus-card">
          <div className="card-title">
            <FaGift />
            <span>ДНЕВЕН БОНУС</span>
          </div>

          <h2>+15</h2>

          <button className="main-btn blue">
            ВЗЕМИ БОНУС
          </button>
        </div>

        <div className="card streak-card">
          <div className="card-title">
            <FaFire />
            <span>STREAK</span>
          </div>

          <h2>7 ДНИ</h2>

          <p>Поредни посещения</p>
        </div>

        <div className="card leaderboard">
          <div className="card-title">
            <FaTrophy />
            <span>ТОП ЛОВЦИ</span>
          </div>

          <div className="leader">
            <span>1. VOID_WALKER</span>
            <b>2560</b>
          </div>

          <div className="leader">
            <span>2. CYBER_WOLF</span>
            <b>1890</b>
          </div>

          <div className="leader">
            <span>3. GLITCH_MASTER</span>
            <b>1620</b>
          </div>

          <div className="leader current">
            <span>4. SHEPOT</span>
            <b>1250</b>
          </div>
        </div>

      </div>

      <div className="bottom-nav">

        <div className="nav-item active-nav">
          <FaHome />
          <span>Начало</span>
        </div>

        <div className="nav-item">
          <FaTrophy />
          <span>Класация</span>
        </div>

        <div className="qr-button">
          <FaQrcode />
        </div>

        <div className="nav-item">
          <FaGift />
          <span>Награди</span>
        </div>

        <div className="nav-item">
          <FaUser />
          <span>Профил</span>
        </div>

      </div>

    </div>
  );
}

export default App;