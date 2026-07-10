import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const CLOUD_NAME = "byzx0nfe";
const UPLOAD_PRESET = "aslanstudyo";

function Announcements() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "announcements"));

      const list = snapshot.docs.map((announcementDoc) => ({
        id: announcementDoc.id,
        ...announcementDoc.data(),
      }));

      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;

        return bTime - aTime;
      });

      setAnnouncements(list);
    } catch (error) {
      console.error("Duyurular yüklenemedi:", error);
      alert("Duyurular yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const publishAnnouncement = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("Lütfen duyuru başlığını yaz.");
      return;
    }

    if (!description.trim()) {
      alert("Lütfen duyuru açıklamasını yaz.");
      return;
    }

    if (!imageFile) {
      alert("Lütfen bir duyuru görseli seç.");
      return;
    }

    const maximumSize = 10 * 1024 * 1024;

    if (imageFile.size > maximumSize) {
      alert("Görsel boyutu en fazla 10 MB olabilir.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "aslanstudyo/announcements");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.error?.message || "Duyuru görseli yüklenemedi."
        );
      }

      await addDoc(collection(db, "announcements"), {
        title: title.trim(),
        description: description.trim(),
        imageUrl: result.secure_url,
        publicId: result.public_id,
        featured,
        createdAt: serverTimestamp(),
      });

      alert("Duyuru başarıyla yayınlandı.");

      setTitle("");
      setDescription("");
      setImageFile(null);
      setFeatured(false);

      const fileInput = document.getElementById(
        "announcement-image-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadAnnouncements();
    } catch (error) {
      console.error("Duyuru yayınlama hatası:", error);
      alert(`Duyuru yayınlanamadı: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeAnnouncement = async (announcement) => {
    const approved = window.confirm(
      `"${announcement.title}" duyurusunu silmek istiyor musun?`
    );

    if (!approved) return;

    try {
      await deleteDoc(doc(db, "announcements", announcement.id));

      setAnnouncements((currentAnnouncements) =>
        currentAnnouncements.filter(
          (item) => item.id !== announcement.id
        )
      );

      alert("Duyuru silindi.");
    } catch (error) {
      console.error("Duyuru silme hatası:", error);
      alert("Duyuru silinemedi.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "Tarih bilgisi yok";

    return new Date(timestamp.seconds * 1000).toLocaleDateString(
      "tr-TR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <div className="dashboard">
      <h1>📰 Duyurular ve Kampanyalar</h1>

      <p>
        Web sitesinde yayınlanacak kampanya ve duyuruları buradan
        yönetebilirsin.
      </p>

      <form
        className="settings-form"
        onSubmit={publishAnnouncement}
      >
        <input
          type="text"
          placeholder="Duyuru başlığı"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={uploading}
        />

        <textarea
          rows={6}
          placeholder="Duyuru açıklaması"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={uploading}
        />

        <input
          id="announcement-image-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) =>
            setImageFile(event.target.files?.[0] || null)
          }
          disabled={uploading}
        />

        {imageFile && (
          <p>
            Seçilen görsel: <strong>{imageFile.name}</strong>
          </p>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) =>
              setFeatured(event.target.checked)
            }
            disabled={uploading}
            style={{ width: "auto" }}
          />

          <span>⭐ Ana sayfada öne çıkar</span>
        </label>

        <button type="submit" disabled={uploading}>
          {uploading
            ? "⏳ Duyuru yayınlanıyor..."
            : "📰 Duyuruyu Yayınla"}
        </button>
      </form>

      <hr style={{ margin: "35px 0" }} />

      <h2>Yayınlanan Duyurular</h2>

      {loading && <p>Duyurular yükleniyor...</p>}

      {!loading && announcements.length === 0 && (
        <p>Henüz duyuru bulunmuyor.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "22px",
          marginTop: "25px",
        }}
      >
        {announcements.map((announcement) => (
          <article
            key={announcement.id}
            style={{
              overflow: "hidden",
              background: "#181818",
              border: announcement.featured
                ? "2px solid #e30613"
                : "1px solid #333",
              borderRadius: "16px",
            }}
          >
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              style={{
                display: "block",
                width: "100%",
                height: "210px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "18px" }}>
              {announcement.featured && (
                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#ff3b45",
                    fontWeight: "700",
                  }}
                >
                  ⭐ Öne Çıkan Duyuru
                </p>
              )}

              <h3 style={{ margin: "0 0 10px" }}>
                {announcement.title}
              </h3>

              <p
                style={{
                  color: "#bbb",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {announcement.description}
              </p>

              <p
                style={{
                  marginTop: "12px",
                  color: "#888",
                  fontSize: "14px",
                }}
              >
                📅 {formatDate(announcement.createdAt)}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeAnnouncement(announcement)
                }
                style={{
                  width: "100%",
                  marginTop: "14px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#e30613",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                🗑️ Duyuruyu Sil
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Announcements;