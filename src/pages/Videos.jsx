import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const CLOUD_NAME = "byzx0nfe";
const UPLOAD_PRESET = "aslanstudyo";

function Videos() {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Düğün");
  const [featured, setFeatured] = useState(false);
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);

      const snapshot = await getDocs(collection(db, "videos"));

      const videoList = snapshot.docs.map((videoDoc) => ({
        id: videoDoc.id,
        ...videoDoc.data(),
      }));

      videoList.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setVideos(videoList);
    } catch (error) {
      console.error("Videolar yüklenemedi:", error);
      alert("Videolar yüklenirken bir hata oluştu.");
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const uploadVideo = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      alert("Lütfen bir video seç.");
      return;
    }

    if (!title.trim()) {
      alert("Lütfen video başlığını yaz.");
      return;
    }

    const maximumSize = 100 * 1024 * 1024;

    if (videoFile.size > maximumSize) {
      alert("Video boyutu en fazla 100 MB olabilir.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "aslanstudyo/videos");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.error?.message || "Cloudinary video yüklemesi başarısız."
        );
      }

      await addDoc(collection(db, "videos"), {
        title: title.trim(),
        category,
        featured,
        videoUrl: result.secure_url,
        publicId: result.public_id,
        duration: result.duration || 0,
        width: result.width || 0,
        height: result.height || 0,
        format: result.format || "",
        originalFilename: videoFile.name,
        createdAt: serverTimestamp(),
      });

      alert("Video başarıyla yüklendi.");

      setVideoFile(null);
      setTitle("");
      setCategory("Düğün");
      setFeatured(false);

      const fileInput = document.getElementById("video-file-input");

      if (fileInput) {
        fileInput.value = "";
      }

      await loadVideos();
    } catch (error) {
      console.error("Video yükleme hatası:", error);
      alert(`Video yüklenemedi: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const makeHeroVideo = async (video) => {
    const approved = window.confirm(
      `"${video.title}" videosunu ana sayfanın arka plan videosu yapmak istiyor musun?`
    );

    if (!approved) {
      return;
    }

    try {
      await setDoc(
        doc(db, "settings", "site"),
        {
          heroVideo: video.videoUrl,
          heroVideoTitle: video.title,
        },
        { merge: true }
      );

      setHeroVideoUrl(video.videoUrl);
      alert("Video ana sayfa arka planı olarak ayarlandı.");
    } catch (error) {
      console.error("Hero video ayarlanamadı:", error);
      alert("Hero video ayarlanamadı.");
    }
  };

  const removeVideo = async (video) => {
    const approved = window.confirm(
      `"${video.title}" videosunu siteden kaldırmak istiyor musun?`
    );

    if (!approved) {
      return;
    }

    try {
      await deleteDoc(doc(db, "videos", video.id));

      setVideos((currentVideos) =>
        currentVideos.filter((item) => item.id !== video.id)
      );

      alert("Video siteden kaldırıldı.");
    } catch (error) {
      console.error("Video silme hatası:", error);
      alert("Video silinemedi.");
    }
  };

  return (
    <div className="dashboard">
      <h1>🎥 Video Yönetimi</h1>

      <p>
        Web sitesinde yayınlanacak videoları buradan yükleyebilir ve
        yönetebilirsin.
      </p>

      <form className="settings-form" onSubmit={uploadVideo}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Video başlığı"
          disabled={uploading}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          disabled={uploading}
        >
          <option value="Düğün">Düğün</option>
          <option value="Nişan">Nişan</option>
          <option value="Kına">Kına Gecesi</option>
          <option value="Drone">Drone</option>
          <option value="Mezuniyet">Mezuniyet</option>
          <option value="Tanıtım">Tanıtım</option>
          <option value="Diğer">Diğer</option>
        </select>

        <input
          id="video-file-input"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
          disabled={uploading}
        />

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
            onChange={(event) => setFeatured(event.target.checked)}
            disabled={uploading}
            style={{ width: "auto" }}
          />

          <span>⭐ Videoyu öne çıkar</span>
        </label>

        {videoFile && (
          <p>
            Seçilen video: <strong>{videoFile.name}</strong>
          </p>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? "⏳ Video yükleniyor..." : "🎥 Videoyu Yükle"}
        </button>
      </form>

      <hr style={{ margin: "35px 0" }} />

      <h2>Yüklenen Videolar</h2>

      {loadingVideos && <p>Videolar yükleniyor...</p>}

      {!loadingVideos && videos.length === 0 && (
        <p>Henüz video bulunmuyor.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "22px",
          marginTop: "25px",
        }}
      >
        {videos.map((video) => {
          const isHero = heroVideoUrl === video.videoUrl;

          return (
            <article
              key={video.id}
              style={{
                background: "#181818",
                border: isHero ? "2px solid #e30613" : "1px solid #333",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <video
                src={video.videoUrl}
                controls
                preload="metadata"
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  background: "#000",
                  borderRadius: "12px",
                }}
              />

              <h3 style={{ margin: "14px 0 8px" }}>{video.title}</h3>

              <p style={{ margin: "6px 0" }}>📂 {video.category}</p>

              {video.featured && (
                <p style={{ margin: "6px 0" }}>⭐ Öne çıkarılmış video</p>
              )}

              {isHero && (
                <p
                  style={{
                    margin: "10px 0",
                    color: "#ff3b45",
                    fontWeight: "700",
                  }}
                >
                  🎬 Aktif Hero Videosu
                </p>
              )}

              <button
                type="button"
                onClick={() => makeHeroVideo(video)}
                style={{
                  width: "100%",
                  marginTop: "14px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: isHero ? "#555" : "#f2b705",
                  color: isHero ? "#fff" : "#111",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {isHero ? "🎬 Hero Videosu Seçili" : "⭐ Bu Videoyu Hero Yap"}
              </button>

              <button
                type="button"
                onClick={() => removeVideo(video)}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#e30613",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                🗑️ Videoyu Kaldır
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Videos;