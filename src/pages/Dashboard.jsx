import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onValue, ref } from "firebase/database";
import { db, realtimeDb } from "../firebase";

function Dashboard() {
  const [photoCount, setPhotoCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const gallerySnap = await getDocs(collection(db, "gallery"));
        setPhotoCount(gallerySnap.size);
      } catch (error) {
        console.error("Galeri istatistiği alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const presenceRef = ref(realtimeDb, "presence");

    const unsubscribe = onValue(
      presenceRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setOnlineCount(0);
          return;
        }

        setOnlineCount(snapshot.size);
      },
      (error) => {
        console.error("Online ziyaretçi sayısı alınamadı:", error);
        setOnlineCount(0);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Kontrol Paneli</h1>
          <p>Aslan CMS genel durum ve canlı ziyaretçi özeti</p>
        </div>

        <div className="live-status">
          <span className="live-status-dot"></span>
          Canlı
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card online-stat-card">
          <div className="stat-icon">🟢</div>

          <div>
            <h3>{onlineCount}</h3>
            <span>Şu Anda Online</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📸</div>

          <div>
            <h3>{loading ? "..." : photoCount}</h3>
            <span>Toplam Fotoğraf</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎥</div>

          <div>
            <h3>0</h3>
            <span>Video</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>

          <div>
            <h3>0</h3>
            <span>Rezervasyon</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>

          <div>
            <h3>0</h3>
            <span>Yorum</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;