import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

function Gallery() {
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  const loadGallery = async () => {
    const snapshot = await getDocs(collection(db, "gallery"));

    const images = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    setGallery(images);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const uploadImage = async () => {
    if (!image) {
      alert("Lütfen bir fotoğraf seç.");
      return;
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "aslan_upload");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/byzx0nfe/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (result.error) {
        alert(result.error.message);
        return;
      }

      await addDoc(collection(db, "gallery"), {
        imageUrl: result.secure_url,
        title: image.name,
        category: "Genel",
        createdAt: serverTimestamp(),
      });

      alert("Fotoğraf başarıyla yüklendi.");
      setImage(null);
      loadGallery();
    } catch (err) {
      console.error(err);
      alert("Yükleme başarısız.");
    }
  };

  const deleteImage = async (id) => {
    const onay = window.confirm("Bu fotoğrafı silmek istediğine emin misin?");
    if (!onay) return;

    try {
      await deleteDoc(doc(db, "gallery", id));
      alert("Fotoğraf silindi.");
      loadGallery();
    } catch (err) {
      console.error(err);
      alert("Silme işlemi başarısız.");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Galeri Yönetimi</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadImage}>📸 Fotoğraf Yükle</button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Yüklenen Fotoğraflar</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {gallery.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#222",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <img
              src={item.imageUrl || item["resim URL'si"]}
              alt={item.title || item["başlık"]}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <h4>{item.title || item["başlık"]}</h4>
            <p>{item.category || item["kategori"]}</p>

            <button
              onClick={() => deleteImage(item.id)}
              style={{
                marginTop: 10,
                width: "100%",
                background: "#e53935",
                color: "#fff",
                border: "none",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🗑 Fotoğrafı Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;