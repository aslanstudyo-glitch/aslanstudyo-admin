function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/images/logo.png" alt="Aslan Stüdyo" />
        <h2>Aslan CMS</h2>
      </div>

      <nav className="sidebar-menu">
        <a href="#">📊 Dashboard</a>
        <a href="#">📸 Galeri</a>
        <a href="#">🎥 Videolar</a>
        <a href="#">💬 Yorumlar</a>
        <a href="#">📅 Rezervasyonlar</a>
        <a href="#">⚙️ Ayarlar</a>
      </nav>
    </aside>
  );
}

export default Sidebar;