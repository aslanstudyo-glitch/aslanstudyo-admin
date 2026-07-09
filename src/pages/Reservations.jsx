import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function Reservations() {
  const [reservations, setReservations] = useState([]);

  const loadReservations = async () => {
    const snap = await getDocs(collection(db, "reservations"));
    const data = snap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    setReservations(data);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const deleteReservation = async (id) => {
    if (!confirm("Bu rezervasyonu silmek istiyor musun?")) return;

    await deleteDoc(doc(db, "reservations", id));
    alert("Rezervasyon silindi.");
    loadReservations();
  };

  return (
    <div className="dashboard">
      <h1>Rezervasyonlar</h1>
      <p>Web sitesinden gelen çekim talepleri burada görünecek.</p>

      <div className="settings-form">
        {reservations.length === 0 && <p>Henüz rezervasyon yok.</p>}

        {reservations.map((item) => (
          <div className="stat-card" key={item.id}>
            <h3>{item.name || "İsimsiz"}</h3>
            <span>📞 {item.phone}</span>
            <br />
            <span>📸 {item.service}</span>
            <br />
            <span>📅 {item.date}</span>
            <br />
            <span>📝 {item.message}</span>

            <button
              onClick={() => deleteReservation(item.id)}
              style={{
                marginTop: 15,
                background: "#e30613",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              🗑 Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reservations;