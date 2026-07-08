function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Aslan Stüdyo yönetim paneline hoş geldiniz.</p>

      <div className="stats-grid">
        <div className="stat-card">📸 <h3>0</h3><span>Fotoğraf</span></div>
        <div className="stat-card">🎥 <h3>0</h3><span>Video</span></div>
        <div className="stat-card">📅 <h3>0</h3><span>Rezervasyon</span></div>
        <div className="stat-card">💬 <h3>0</h3><span>Yorum</span></div>
      </div>
    </div>
  );
}

export default Dashboard;