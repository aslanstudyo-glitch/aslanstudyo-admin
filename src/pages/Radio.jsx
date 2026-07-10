function Radio() {
  return (
    <div className="dashboard">
      <h1>📻 Aslan Radyo</h1>

      <p>Aslan Radyo yönetim paneline hoş geldiniz.</p>

      <div className="settings-form">
        <h3>🎵 Radyo Sistemi</h3>

        <p>
          Bir sonraki adımda buradan MP3 yükleyebilecek, çalma listesi
          oluşturabilecek ve web sitesindeki oynatıcıyı yönetebileceksiniz.
        </p>

        <button
          style={{
            padding: "15px",
            background: "#e30613",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🎵 İlk Şarkıyı Yükle
        </button>
      </div>
    </div>
  );
}

export default Radio;