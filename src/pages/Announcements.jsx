import { useState } from "react";

function Announcements() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="dashboard">
      <h1>📰 Duyurular ve Kampanyalar</h1>

      <p>
        Web sitesinde yayınlanacak duyuruları buradan yönetebilirsin.
      </p>

      <form className="settings-form">
        <input
          type="text"
          placeholder="Duyuru başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows={6}
          placeholder="Duyuru açıklaması"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input type="file" accept="image/*" />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <input type="checkbox" style={{ width: "auto" }} />
          ⭐ Ana Sayfada Öne Çıkar
        </label>

        <button type="submit">
          📰 Duyuruyu Yayınla
        </button>
      </form>

      <hr style={{ margin: "35px 0" }} />

      <h2>Yayınlanan Duyurular</h2>

      <p>Henüz duyuru bulunmuyor.</p>
    </div>
  );
}

export default Announcements;