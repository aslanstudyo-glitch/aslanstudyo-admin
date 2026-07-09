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
  });

  useEffect(() => {
    const loadSettings = async () => {
      const ref = doc(db, "settings", "site");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSettings(snap.data());
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
    alert("Ayarlar kaydedildi.");
  };

  return (
    <div className="settings-page">
      <h1>Ayarlar</h1>
      <p>Site iletişim ve işletme bilgilerini buradan yönetebilirsiniz.</p>

      <div className="settings-form">
        <input name="phone" value={settings.phone} onChange={handleChange} placeholder="Telefon" />
        <input name="whatsapp" value={settings.whatsapp} onChange={handleChange} placeholder="WhatsApp" />
        <input name="email" value={settings.email} onChange={handleChange} placeholder="E-posta" />
        <input name="instagram" value={settings.instagram} onChange={handleChange} placeholder="Instagram" />
        <input name="facebook" value={settings.facebook} onChange={handleChange} placeholder="Facebook" />
        <input name="tiktok" value={settings.tiktok} onChange={handleChange} placeholder="TikTok" />
        <input name="hours" value={settings.hours} onChange={handleChange} placeholder="Çalışma Saatleri" />
        <input name="slogan" value={settings.slogan} onChange={handleChange} placeholder="Slogan" />

        <textarea
          name="address"
          value={settings.address}
          onChange={handleChange}
          placeholder="Adres"
          rows="4"
        />

        <button onClick={saveSettings}>💾 Kaydet</button>
      </div>
    </div>
  );
}

export default Settings;