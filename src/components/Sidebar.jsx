function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/images/logo.png" alt="Aslan Stüdyo" />
        <h2>Aslan CMS</h2>
      </div>

      <nav className="sidebar-menu">
        <button
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          📊 Kontrol Paneli
        </button>

        <button
          className={activePage === "gallery" ? "active" : ""}
          onClick={() => setActivePage("gallery")}
        >
          📸 Galeri
        </button>

        <button
          className={activePage === "videos" ? "active" : ""}
          onClick={() => setActivePage("videos")}
        >
          🎥 Videolar
        </button>

        <button
          className={activePage === "radio" ? "active" : ""}
          onClick={() => setActivePage("radio")}
        >
          📻 Radyo
        </button>

        <button
          className={activePage === "announcements" ? "active" : ""}
          onClick={() => setActivePage("announcements")}
        >
          📰 Duyurular
        </button>

        <button>
          💬 Yorumlar
        </button>

        <button
          className={activePage === "reservations" ? "active" : ""}
          onClick={() => setActivePage("reservations")}
        >
          📅 Rezervasyonlar
        </button>

        <button
          className={activePage === "settings" ? "active" : ""}
          onClick={() => setActivePage("settings")}
        >
          ⚙️ Ayarlar
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;