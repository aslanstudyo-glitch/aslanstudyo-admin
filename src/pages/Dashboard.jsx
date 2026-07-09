import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Dashboard() {
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const gallerySnap = await getDocs(collection(db, "gallery"));
      setPhotoCount(gallerySnap.size);
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Kontrol Paneli</h1>
      <p>Aslan CMS genel durum özeti</p>

      <div className="stats-grid">
        <div className="stat-card">
          📸
          <h3>{photoCount}</h3>
          <span>Toplam Fotoğraf</span>
        </div>

        <div className="stat-card">
          🎥
          <h3>0</h3>
          <span>Video</span>
        </div>

        <div className="stat-card">
          📅
          <h3>0</h3>
          <span>Rezervasyon</span>
        </div>

        <div className="stat-card">
          💬
          <h3>0</h3>
          <span>Yorum</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;