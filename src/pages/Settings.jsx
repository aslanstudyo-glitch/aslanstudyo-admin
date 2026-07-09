import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Settings() {
  const [settings, setSettings] = useState({
    phone: "0533 322 95 60",
    whatsapp: "0533 322 95 60",
    email: "aslanstudyo@gmail.com",
    address: "Çayırlık Mah. Aksaray Cad. No:23/C Acıgöl / Nevşehir",
    instagram: "@aslanstudyo",
    facebook: "@aslanstudyo",
    tiktok: "@aslanstudyo",
    hours: "09:00 - 19:00",

    slogan: "Hatıralar Aslan'la Sonsuz",

    heroTitle: "ASLAN STÜDYO",
    heroSubtitle: "Hatıralar Aslan'la Sonsuz",
    heroDescription:
      "Düğün • Nişan • Kına • Drone • Mezuniyet • Aile Çekimi",
    heroButton1: "Galeriyi Keşfet",
    heroButton2: "WhatsApp",
  });

  useEffect(() => {
    const loadSettings = async () => {
      const ref = doc(db, "settings", "site");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSettings({
          ...settings,
          ...snap.data(),
        });
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const saveSettings = async () => {
    await setDoc(doc(db, "settings", "site"), settings);
    alert("✅ Ayarlar başarıyla kaydedildi.");
  };

  return (
    <div className="settings-page">
      <h1>⚙️ Site Ayarları</h1>
      <p>Web sitesindeki tüm bilgileri buradan değiştirebilirsiniz.</p>

      <div className="settings-form">
        <input
          name="phone"
          value={settings.phone}
          onChange={handleChange}
          placeholder="Telefon"
        />

        <input
          name="whatsapp"
          value={settings.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp"
        />

        <input
          name="email"
          value={settings.email}
          onChange={handleChange}
          placeholder="E-posta"
        />

        <input
          name="instagram"
          value={settings.instagram}
          onChange={handleChange}
          placeholder="Instagram"
        />

        <input
          name="facebook"
          value={settings.facebook}
          onChange={handleChange}
          placeholder="Facebook"
        />

        <input
          name="tiktok"
          value={settings.tiktok}
          onChange={handleChange}
          placeholder="TikTok"
        />

        <input
          name="hours"
          value={settings.hours}
          onChange={handleChange}
          placeholder="Çalışma Saatleri"
        />

        <input
          name="slogan"
          value={settings.slogan}
          onChange={handleChange}
          placeholder="Site Sloganı"
        />

        <hr />

        <h3>Ana Sayfa (Hero)</h3>

        <input
          name="heroTitle"
          value={settings.heroTitle}
          onChange={handleChange}
          placeholder="Ana Başlık"
        />

        <input
          name="heroSubtitle"
          value={settings.heroSubtitle}
          onChange={handleChange}
          placeholder="Hero Slogan"
        />

        <input
          name="heroDescription"
          value={settings.heroDescription}
          onChange={handleChange}
          placeholder="Hero Açıklama"
        />

        <input
          name="heroButton1"
          value={settings.heroButton1}
          onChange={handleChange}
          placeholder="1. Buton Yazısı"
        />

        <input
          name="heroButton2"
          value={settings.heroButton2}
          onChange={handleChange}
          placeholder="2. Buton Yazısı"
        />

        <textarea
          name="address"
          value={settings.address}
          onChange={handleChange}
          rows="4"
          placeholder="Adres"
        />

        <button onClick={saveSettings}>
          💾 Ayarları Kaydet
        </button>
      </div>
    </div>
  );
}

export default Settings;