# Demiröz ✕ Koç — Mimarlık • Tasarım

Statik web sitesi. Build adımı, paket yöneticisi veya framework yok — düz HTML/CSS/JS.
Klasörü olduğu gibi herhangi bir statik hosting'e (Netlify, Vercel, GitHub Pages, cPanel)
yükleyebilirsiniz.

## Yerelde çalıştırma

```powershell
python -m http.server 5173
# http://localhost:5173
```

## Dosya yapısı

```
index.html         Anasayfa — hero, stüdyo girişi, seçili işler, hizmetler
projeler.html      Proje arşivi — kategori filtresi
zabjelo.html       GERÇEK PROJE — Zabjelo Kültür ve Toplum Merkezi
proje.html         Proje detay ŞABLONU (içeriği yer tutucu)
studyo.html        Stüdyo — yaklaşım, ekip, ödüller
iletisim.html      İletişim — bilgiler, form, harita

css/main.css       Tüm tasarım sistemi (tek dosya)
js/i18n.js         İngilizce çeviriler
js/main.js         Menü, dil değiştirme, scroll animasyonları, filtre,
                   kütle gelişim oynatıcısı, form

assets/            Logo varyantları + favicon
assets/img/        Yer tutucu görseller (SVG)
assets/img/zabjelo/  Zabjelo projesinin optimize edilmiş gerçek görselleri

VERI/              Ham kaynak dosyalar (siteye dahil değil — yayına
                   yüklemenize gerek yok)
```

## Marka

| Öğe | Değer | Nerede |
|---|---|---|
| Tipografi | **Montserrat** (200/300/400/500/600) | `VERI/genel yazı fontu/` içindeki marka fontu; sitede Google Fonts üzerinden yükleniyor |
| Vurgu rengi | `#0243FC` | Logodaki X'ten örneklendi — `--blue` |
| Mürekkep | `#0C0C0D` | `--ink` |
| Zemin | `#FBFBF9` (sıcak kırık beyaz) | `--paper` |

Logo, 2026 vektör dosyalarından dört varyant olarak üretildi ve **dile göre otomatik
değişiyor** — TR'de `MİMARLIK • TASARIM`, EN'de `ARCHITECTURE & DESIGN`:

```
assets/logo-tr.png     assets/logo-tr-w.png    (açık zemin / koyu zemin)
assets/logo-en.png     assets/logo-en-w.png
```

Beyaz zemin şeffaflaştırıldı, koyu zemin varyantlarında yazı beyaza çevrilirken mavi X korundu.

Fontu tamamen kendi sunucunuzdan servis etmek isterseniz TTF dosyaları
`VERI/genel yazı fontu/Montserrat13/` içinde; `@font-face` ile bağlayıp
HTML'lerdeki Google Fonts `<link>` satırını kaldırın.

## Zabjelo projesi

`zabjelo.html` gerçek içerikle dolu. Metinler doğrudan stüdyonun kendi yarışma
raporundan (`VERI/zabjelo community centre/RAPOR/mimari rapor_2.docx`) alındı —
Türkçesi HTML'de, İngilizcesi raporun kendi İngilizce bölümünden `js/i18n.js` içinde.

### Kütle gelişim animasyonu

Sekiz kütle diyagramı (A–H) GIF yerine **görsel dizisi** olarak kuruldu:

- GIF 256 renkle sınırlı olurdu; bu diyagramlarda degrade ve ince çizgi çok — bozulurdu.
- Bu haliyle her genişlikte net kalıyor, kareler `loading="lazy"` ile geliyor.
- İzleyici sadece izlemekle kalmıyor, adımlar arasında **tıklayarak gezinebiliyor**.
- Ekranda değilken ve sekme arka plandayken duruyor; `prefers-reduced-motion` açıksa
  hiç oynatmıyor.

Kareler ortak bir kadraja kırpıldı (`assets/img/zabjelo/mass-a…h.jpg`), böylece
geçişlerde titreme olmuyor. Kod: `js/main.js` → `massfilm`.

**Kontrol edilmeli:** Sekiz adımın altındaki açıklamalar (`data-caption` /
`js/i18n.js` içindeki `z.m1`–`z.m8`) diyagramlara bakılarak benim tarafımdan yazıldı,
raporda karşılıkları yok. Kendi ifadelerinizle değiştirmek isteyebilirsiniz.

### Görseller

`VERI/zabjelo community centre/` altındaki orijinaller (5357px, 7016px) web için
yeniden boyutlandırıldı: renderlar 2000–2560px, çizimler 2400px, JPEG kalite 84–86.
Toplam ~13 MB. Daha da küçültmek isterseniz WebP'ye çevirmek boyutu yarıya indirir.

## Hâlâ yer tutucu olanlar

- **Diğer 8 proje** — `projeler.html` ve `index.html` içindeki isimler, yıllar,
  şehirler uydurma. Görselleri `assets/img/p-01…08.svg` soyut yer tutucu.
- **`proje.html`** — Nişantaşı Rezidans diye bir proje yok; bu sadece yeni proje
  sayfası açarken kopyalayacağınız şablon.
- **Kurucu özgeçmişleri** — isimler doğru (İrem Demiröz Koç, Burak Koç) ama
  biyografiler açık yer tutucu; eğitim/deneyim bilgisi elimde yoktu.
  `studyo.html` + `js/i18n.js` → `team.1.d`, `team.2.d`.
- **Ekip fotoğrafları** — `assets/img/team-01.svg`, `team-02.svg` soyut yer tutucu.
- **Ödüller** — `studyo.html` içindeki dört ödül satırı uydurma.
- **İşveren notu** — `studyo.html` sonundaki "Özel işverenler, geliştiriciler,
  belediyeler…" cümlesi de doğrulanmadı.
- **Açık adres** — `iletisim.html` içindeki "Cinnah Cad. No. 00, Kat 3, Çankaya"
  yer tutucudur. Şehir (Ankara) doğru, sokak/numara uydurma.
  (E-posta `info@demirozkoc.com` ve telefon `+90 546 467 76 96` gerçek.)
- **Harita** — `iletisim.html` içindeki OpenStreetMap `bbox` şu an Çankaya/Ankara'yı
  gösteriyor; gerçek adrese göre ince ayar gerekiyor.

## İletişim formu

Form şu an yalnızca ön yüzde çalışıyor; hiçbir yere veri göndermiyor
(`js/main.js` → `contactForm`). Canlıya almadan önce bağlanmalı:

- **Netlify Forms** — `<form>` etiketine `netlify` niteliği ekleyin, JS handler'ı kaldırın.
- **Formspree** — `action="https://formspree.io/f/XXXX" method="POST"` ekleyin.
- **Kendi API'niz** — submit handler'da `fetch()` çağrısı yapın.

## Yeni proje sayfası ekleme

Gerçek bir proje için `zabjelo.html`'i kopyalayın (şablon `proje.html`'den çok
daha zengin: künye tablosu, bölüm numaralandırması, çizim plakaları, galeri):

1. `zabjelo.html` → `yeni-proje.html`
2. Görselleri `assets/img/yeni-proje/` altına koyun ve `src`'leri güncelleyin.
3. Metinleri değiştirin; `data-i18n` anahtarlarını yeni bir önekle
   (`y.` gibi) yeniden adlandırıp İngilizcelerini `js/i18n.js`'e ekleyin.
4. Kütle animasyonu yoksa `massfilm` bölümünü silin — JS kendini kapatır.
5. `projeler.html` ve `index.html` içine kartını ekleyin, numaraları kaydırın,
   `#workCount` sayısını güncelleyin.
6. Alt gezinme (`.pager`) linklerini komşu projelere yönlendirin.

## Çok dillilik (TR / EN)

Türkçe metin doğrudan HTML içindedir — JavaScript kapalı olsa bile site tam okunur.
İngilizcesi `js/i18n.js` içinde `data-i18n` anahtarlarıyla eşlenir.

```html
<p data-i18n="benim.anahtarim">Türkçe metin</p>
```
```js
"benim.anahtarim": "English text",
```

- Input `placeholder`'ları: `data-i18n-ph`
- Sayfa başlığı: `<body data-title-en="...">`
- Dile göre değişen görsel (logo): `data-src-tr` / `data-src-en`
- Seçilen dil `localStorage`'da (`dk-lang`) saklanır

## Notlar

- Tüm etkileşimli öğeler klavyeyle kullanılabilir; `:focus-visible` görünür outline verir.
- `prefers-reduced-motion` desteklenir — tüm animasyonlar kapanır.
- Görseller `loading="lazy"`; hero hariç (`fetchpriority="high"`).
- Tek harici bağımlılık Google Fonts.
- `VERI/` klasörünü yayına yüklemenize gerek yok (~250 MB ham dosya).
