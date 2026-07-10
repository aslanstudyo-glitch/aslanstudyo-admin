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

function Radio() {
  const [audioFile, setAudioFile] = useState(null);
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [songs, setSongs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(true);

  const loadSongs = async () => {
    try {
      setLoadingSongs(true);

      const snapshot = await getDocs(collection(db, "songs"));

      const songList = snapshot.docs.map((songDoc) => ({
        id: songDoc.id,
        ...songDoc.data(),
      }));

      songList.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setSongs(songList);
    } catch (error) {
      console.error("Şarkılar yüklenemedi:", error);
      alert("Şarkılar yüklenirken hata oluştu.");
    } finally {
      setLoadingSongs(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const uploadSong = async (event) => {
    event.preventDefault();

    if (!audioFile) {
      alert("Lütfen bir MP3 dosyası seç.");
      return;
    }

    if (!songTitle.trim()) {
      alert("Lütfen şarkı adını yaz.");
      return;
    }

    const maximumSize = 50 * 1024 * 1024;

    if (audioFile.size > maximumSize) {
      alert("Ses dosyası en fazla 50 MB olabilir.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "aslanstudyo/radio");

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
          result.error?.message || "Ses dosyası yüklenemedi."
        );
      }

      await addDoc(collection(db, "songs"), {
        title: songTitle.trim(),
        artist: artist.trim() || "Bilinmeyen Sanatçı",
        audioUrl: result.secure_url,
        publicId: result.public_id,
        duration: result.duration || 0,
        format: result.format || "",
        originalFilename: audioFile.name,
        createdAt: serverTimestamp(),
      });

      alert("Şarkı başarıyla yüklendi.");

      setAudioFile(null);
      setSongTitle("");
      setArtist("");

      const fileInput = document.getElementById("radio-file-input");

      if (fileInput) {
        fileInput.value = "";
      }

      await loadSongs();
    } catch (error) {
      console.error("Şarkı yükleme hatası:", error);
      alert(`Şarkı yüklenemedi: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeSong = async (song) => {
    const approved = window.confirm(
      `"${song.title}" şarkısını listeden kaldırmak istiyor musun?`
    );

    if (!approved) {
      return;
    }

    try {
      await deleteDoc(doc(db, "songs", song.id));

      setSongs((currentSongs) =>
        currentSongs.filter((item) => item.id !== song.id)
      );

      alert("Şarkı listeden kaldırıldı.");
    } catch (error) {
      console.error("Şarkı silme hatası:", error);
      alert("Şarkı silinemedi.");
    }
  };

  return (
    <div className="dashboard">
      <h1>📻 Aslan Radyo</h1>

      <p>
        Radyo çalma listesine MP3 yükleyebilir, dinleyebilir ve silebilirsin.
      </p>

      <form className="settings-form" onSubmit={uploadSong}>
        <input
          type="text"
          value={songTitle}
          onChange={(event) => setSongTitle(event.target.value)}
          placeholder="Şarkı adı"
          disabled={uploading}
        />

        <input
          type="text"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
          placeholder="Sanatçı adı"
          disabled={uploading}
        />

        <input
          id="radio-file-input"
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
          onChange={(event) =>
            setAudioFile(event.target.files?.[0] || null)
          }
          disabled={uploading}
        />

        {audioFile && (
          <p>
            Seçilen dosya: <strong>{audioFile.name}</strong>
          </p>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? "⏳ Şarkı yükleniyor..." : "🎵 Şarkıyı Yükle"}
        </button>
      </form>

      <hr style={{ margin: "35px 0" }} />

      <h2>Çalma Listesi</h2>

      {loadingSongs && <p>Şarkılar yükleniyor...</p>}

      {!loadingSongs && songs.length === 0 && (
        <p>Henüz şarkı yüklenmedi.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "18px",
          marginTop: "25px",
        }}
      >
        {songs.map((song) => (
          <article
            key={song.id}
            style={{
              background: "#181818",
              border: "1px solid #333",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <h3 style={{ margin: "0 0 6px" }}>{song.title}</h3>
            <p style={{ margin: "0 0 14px", color: "#bbb" }}>
              🎤 {song.artist}
            </p>

            <audio
              src={song.audioUrl}
              controls
              preload="metadata"
              style={{ width: "100%" }}
            />

            <button
              type="button"
              onClick={() => removeSong(song)}
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
              🗑️ Şarkıyı Kaldır
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Radio;