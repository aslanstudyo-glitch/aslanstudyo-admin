import { useEffect, useMemo, useState } from "react";
import {
  onValue,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import { realtimeDb } from "../firebase";

function getTodayKey() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Analytics() {
  const [visitors, setVisitors] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [last24Visits, setLast24Visits] = useState(0);
  const [loading, setLoading] = useState(true);

  // Anlık çevrim içi ziyaretçiler
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
        console.error("Canlı ziyaretçiler alınamadı:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Toplam ziyaret sayısı
  useEffect(() => {
    const totalVisitsRef = ref(
      realtimeDb,
      "analytics/summary/totalVisits"
    );

    const unsubscribe = onValue(
      totalVisitsRef,
      (snapshot) => {
        setTotalVisits(snapshot.val() || 0);
      },
      (error) => {
        console.error("Toplam ziyaret alınamadı:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Bugünkü ziyaret sayısı
  useEffect(() => {
    const todayKey = getTodayKey();

    const todayVisitsRef = ref(
      realtimeDb,
      `analytics/daily/${todayKey}/visits`
    );

    const unsubscribe = onValue(
      todayVisitsRef,
      (snapshot) => {
        setTodayVisits(snapshot.val() || 0);
      },
      (error) => {
        console.error("Bugünkü ziyaret alınamadı:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Son 24 saatteki ziyaretler
  useEffect(() => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

    const visitLogsQuery = query(
      ref(realtimeDb, "analytics/visitLogs"),
      orderByChild("visitedAt"),
      startAt(twentyFourHoursAgo)
    );

    const unsubscribe = onValue(
      visitLogsQuery,
      (snapshot) => {
        setLast24Visits(snapshot.size);
      },
      (error) => {
        console.error("Son 24 saat verisi alınamadı:", error);
        setLast24Visits(0);
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
          <p>
            Aslan Stüdyo ziyaretçi ve sayfa hareketleri
          </p>
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
          <div className="stat-icon">👥</div>

          <div>
            <h3>{todayVisits.toLocaleString("tr-TR")}</h3>
            <span>Bugünkü Ziyaret</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌍</div>

          <div>
            <h3>{totalVisits.toLocaleString("tr-TR")}</h3>
            <span>Toplam Ziyaret</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>

          <div>
            <h3>{last24Visits.toLocaleString("tr-TR")}</h3>
            <span>Son 24 Saat</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>

          <div>
            <h3>{sortedPages.length}</h3>
            <span>Şu Anda Aktif Sayfa</span>
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
              Şu anda aktif ziyaretçi bulunmuyor.
            </p>
          )}

          {!loading && visitors.length > 0 && (
            <div className="live-visitors-list">
              {visitors.map((visitor, index) => (
                <div
                  className="live-visitor-row"
                  key={visitor.id}
                >
                  <div className="visitor-number">
                    {index + 1}
                  </div>

                  <div className="visitor-info">
                    <strong>Ziyaretçi</strong>

                    <span>
                      {formatPageName(visitor.page || "/")}
                    </span>
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
                    ? Math.round(
                        (count / visitors.length) * 100
                      )
                    : 0;

                return (
                  <div
                    className="page-activity-item"
                    key={page}
                  >
                    <div className="page-activity-top">
                      <strong>
                        {formatPageName(page)}
                      </strong>

                      <span>{count} kişi</span>
                    </div>

                    <div className="page-activity-bar">
                      <span
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></span>
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

          <h2>Ziyaret Grafikleri ve Cihazlar</h2>

          <p>
            Günlük ziyaret grafiği, mobil ve bilgisayar
            dağılımı, tarayıcı bilgileri ve en çok ziyaret
            edilen sayfalar sonraki aşamada eklenecek.
          </p>
        </div>

        <div className="analytics-coming-tags">
          <span>📈 Grafikler</span>
          <span>📱 Cihazlar</span>
          <span>🌐 Tarayıcılar</span>
          <span>🏆 Sayfalar</span>
        </div>
      </section>
    </div>
  );
}

export default Analytics;