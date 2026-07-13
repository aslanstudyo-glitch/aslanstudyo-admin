import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../firebase";

function Analytics() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const presenceRef = ref(realtimeDb, "presence");

    const unsubscribe = onValue(
      presenceRef,
      (snapshot) => {
        const list = [];

        snapshot.forEach((childSnapshot) => {
          list.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });

        setVisitors(list);
        setLoading(false);
      },
      (error) => {
        console.error("Analytics verileri alınamadı:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const pageCounts = useMemo(() => {
    return visitors.reduce((result, visitor) => {
      const page = visitor.page || "/";

      result[page] = (result[page] || 0) + 1;

      return result;
    }, {});
  }, [visitors]);

  const sortedPages = useMemo(() => {
    return Object.entries(pageCounts).sort(
      (first, second) => second[1] - first[1]
    );
  }, [pageCounts]);

  const formatPageName = (page) => {
    const pageNames = {
      "/": "Ana Sayfa",
      "/kunye": "Künye",
      "/kvkk": "KVKK",
      "/gizlilik": "Gizlilik Politikası",
      "/cerez-politikasi": "Çerez Politikası",
      "/iletisim": "İletişim",
    };

    return pageNames[page] || page;
  };

  return (
    <div className="dashboard analytics-page">
      <div className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p>Aslan Stüdyo canlı ziyaretçi ve sayfa hareketleri</p>
        </div>

        <div className="live-status">
          <span className="live-status-dot"></span>
          Canlı
        </div>
      </div>

      <div className="stats-grid analytics-stats-grid">
        <div className="stat-card online-stat-card">
          <div className="stat-icon">🟢</div>

          <div>
            <h3>{loading ? "..." : visitors.length}</h3>
            <span>Şu Anda Online</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>

          <div>
            <h3>{sortedPages.length}</h3>
            <span>Aktif Sayfa</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>

          <div>
            <h3>{sortedPages[0]?.[1] || 0}</h3>
            <span>En Yoğun Sayfa</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <span>Canlı</span>
              <h2>Aktif Ziyaretçiler</h2>
            </div>

            <strong>{visitors.length} kişi</strong>
          </div>

          {loading && (
            <p className="analytics-empty">
              Ziyaretçi verileri yükleniyor...
            </p>
          )}

          {!loading && visitors.length === 0 && (
            <p className="analytics-empty">
              Şu anda sitede aktif ziyaretçi bulunmuyor.
            </p>
          )}

          {!loading && visitors.length > 0 && (
            <div className="live-visitors-list">
              {visitors.map((visitor, index) => (
                <div className="live-visitor-row" key={visitor.id}>
                  <div className="visitor-number">{index + 1}</div>

                  <div className="visitor-info">
                    <strong>Ziyaretçi</strong>
                    <span>{formatPageName(visitor.page || "/")}</span>
                  </div>

                  <span className="visitor-online-badge">
                    Çevrim içi
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <span>Sayfalar</span>
              <h2>Şu Anda Gezilen Sayfalar</h2>
            </div>
          </div>

          {sortedPages.length === 0 && (
            <p className="analytics-empty">
              Henüz aktif sayfa verisi bulunmuyor.
            </p>
          )}

          {sortedPages.length > 0 && (
            <div className="page-activity-list">
              {sortedPages.map(([page, count]) => {
                const percentage =
                  visitors.length > 0
                    ? Math.round((count / visitors.length) * 100)
                    : 0;

                return (
                  <div className="page-activity-item" key={page}>
                    <div className="page-activity-top">
                      <strong>{formatPageName(page)}</strong>
                      <span>{count} kişi</span>
                    </div>

                    <div className="page-activity-bar">
                      <span style={{ width: `${percentage}%` }}></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="analytics-panel analytics-coming-soon">
        <div>
          <span>Sıradaki aşama</span>
          <h2>Gelişmiş Ziyaret Raporları</h2>
          <p>
            Bugünkü ziyaret, toplam ziyaret, son 24 saat, cihaz
            dağılımı ve günlük grafikler sonraki aşamada eklenecek.
          </p>
        </div>

        <div className="analytics-coming-tags">
          <span>📅 Bugün</span>
          <span>🌍 Toplam</span>
          <span>📱 Cihazlar</span>
          <span>📈 Grafikler</span>
        </div>
      </section>
    </div>
  );
}

export default Analytics;