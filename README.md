# Demiröz & Koç Mimarlık — web sitesi

Statik site. Build adımı, paket yöneticisi veya framework yok — düz HTML/CSS/JS.
Klasörü olduğu gibi herhangi bir statik hosting'e yükleyebilirsiniz.

## Yerelde çalıştırma

```powershell
python -m http.server 5174
# http://localhost:5174
```

## Yayına alma

İki ayrı yer var, karıştırmayın:

| | Ne | Nasıl güncellenir |
|---|---|---|
| **demirozkoc.com** | Yayındaki site — şu an **yapım aşamasında sayfası** (kaynağı `hold/`) | isimtescil'de barınıyor: Plesk / Windows (IIS), web kökü `httpdocs`. Dosyaları FTP ile `httpdocs`'a yüklemek gerekir. **Git'e push etmek bu siteyi değiştirmez.** |
| **nihanmalkoc.github.io/demiroz-koc** | Müşteriye gönderilen **taslak önizleme** | GitHub Pages, `main` dalının kökünden yayınlanıyor. `main`'e push edilince kendisi güncelleniyor (1–2 dakika). |

Panel adresi, FTP kullanıcısı ve şifreler bu depoda **tutulmuyor** — depo herkese
açık. O bilgiler isimtescil hesabındaki e-postada; gerekirse oradan alın.

Ana site hazır olduğunda `httpdocs` içindeki `index.html` ve `assets/` değiştirilir.

## Sayfalar

```
index.html         Anasayfa — 6 kareli render slaytı + iletişim
projeler.html      Proje arşivi — 6 gerçek proje, kategori filtresi
studyo.html        Ofis yazısı, çalışma alanları, kurucu
iletisim.html      İletişim bilgileri, form

zabjelo.html       Zabjelo Kültür ve Toplum Merkezi   (2026, Podgorica)
yesilbayir.html    Yeşilbayır Evi                      (2026, Antalya)
akas.html          Akas Çamlıca İç Mekân Tasarımları  (2023, İstanbul)
ordu.html          Ordu'da Müstakil Konut              (2021, Ordu)
merzifon.html      Merzifon İş ve Yaşam Merkezi        (2017, Amasya)
tekirdag.html      Tekirdağ Süleymanpaşa Belediye      (2017, Tekirdağ)

proje.html         ŞABLON — yeni proje eklerken kopyalanır (içeriği yer tutucu)
```

## İçeriğin kaynağı

Bütün metinler, künye bilgileri ve görseller `VERI/` klasöründeki dosyalardan alındı:

| İçerik | Kaynak |
|---|---|
| Ofis tanıtım yazısı | `VERI/2026_WEB SİTESİ/stüdyo/ofis bilgi yazısı.docx` |
| Burak Koç özgeçmişi + fotoğraf | `VERI/2026_WEB SİTESİ/stüdyo/burak koç cv.docx`, `burak_foto.jpg` |
| Stüdyo sayfası ofis fotoğrafı | `VERI/office background.jpg` — dikey orijinal, 3:2 yatay kırpıldı |
| 5 projenin künyesi ve tasarım metni | `VERI/2026_WEB SİTESİ/projeler/*/` |
| Zabjelo raporu (TR + EN) | `VERI/zabjelo community centre/RAPOR/mimari rapor_2.docx` |
| Marka fontu (Montserrat) | `VERI/genel yazı fontu/` |
| Logo (2026 vektör) | `VERI/logo/` |

Görseller TIF/JPG orijinallerinden web için yeniden boyutlandırıldı: renderlar
2000–2400px, çizimler 2400px, JPEG kalite 84–86.

## Tasarım sistemi

`css/main.css` en üstündeki `:root` bloğu her şeyi kontrol eder:

| Token | Değer | Ne için |
|---|---|---|
| `--ink` | `#0C0C0D` | Ana metin, koyu bölümler |
| `--paper` | `#FBFBF9` | Sıcak kırık beyaz zemin |
| `--blue` | `#0243FC` | Logodaki X'ten alınan tek vurgu rengi |
| `--font-display` / `--font-body` | Montserrat | Marka fontu, Google Fonts üzerinden |
| `--gutter` | `clamp(1.25rem, 4.5vw, 5rem)` | Yatay kenar boşluğu |
| `--section` | `clamp(5rem, 12vh, 10rem)` | Bölüm arası dikey ritim |

Logo dört varyant, **dile göre otomatik değişiyor** — TR'de `MİMARLIK • TASARIM`,
EN'de `ARCHITECTURE & DESIGN`: `assets/logo-{tr,en}[-w].png` (`-w` = koyu zemin).

## Bileşenler

**Anasayfa slaytı** — `js/main.js` → `heroSlides`. Süreler CSS ve JS'te birbirine
bağlı: render süresi `HOLD` (3,4 sn), çapraz geçiş 1 sn ve zoom 5,5 sn
(`css/main.css` → `.hero__media img`). Üçünü birlikte değiştirin.

**Kütle gelişim dizisi** — `.massfilm`. GIF yerine görsel dizisi: her genişlikte
net kalır, adımlar tıklanabilir, ekran dışındayken durur. Bir sayfada birden
fazla olabilir (Merzifon'da iki tane: kütle gelişimi + kullanım senaryoları).
Genişliği bilinçli olarak `max-width: 48rem` ile sınırlı (sahne ≈ 768×503);
sınır kalkarsa geniş ekranda 1580×1035'e çıkıp çevresindeki çizimleri bastırıyor.
Kareler lightbox'a dahil değil, yani büyütülemiyor — boyutu daha da küçültmek
gerekirse önce bir büyütme yolu düşünmek lazım.

**Lightbox galeri** — `<main data-gallery>` içindeki tüm görseller tek galeri olur
(`.massfilm` kareleri hariç). Ok tuşları, kaydırma, Esc, sayaç, şekil altı yazısı.
`.lb__stage` satır/kolonları **`minmax(0, 1fr)` olarak yazılmak zorunda**: örtük
`auto` track boyutunu görselden alır, görselin `max-height: 100%` değeri de
track'ten — döngüsel yüzde oluşur, tarayıcı yüzdeyi yok sayar ve dikey görseller
(ör. `dia-function.jpg`, 2400×3394) ekrandan taşar.

**Proje künyesi** — başlığın yanında `.spec` bloğu, altı satır: İşlev / Konum ve
tarih / Arsa alanı / İnşaat alanı / Durum / Ekip. Değer bilinmiyorsa `—` bırakın.

**Proje sayfası şablonu** — kurallar `css/main.css` içinde
`[data-page="project"]` bloğunda; altı sayfanın hepsi aynı kurallara bağlı,
sayfa başına özel CSS yok. Şablonun mantığı:

- **Fotoğraf grubu tam genişlik, tek sıra.** Ayırt etme `:has(.plate)` ile
  yapılıyor: içinde çizim çerçevesi olmayan `.dwg-pair` tek kolona düşer. Yani
  yeni bir render eklerken fazladan bir sınıfa gerek yok — çerçeve varsa çizim,
  yoksa fotoğraf.
- **Çizimler eşit yükseklikli `.plate` içinde.** Paylaşılan *oran* değil,
  paylaşılan *yükseklik*: çizim oranları 0,62 (üst üste planlar) ile 5,3 (uzun
  görünüşler) arasında değişiyor, sabit bir oran ya kırpar ya da kocaman
  boşluk bırakırdı. Eşit yükseklik satırları — dolayısıyla şekil altı
  yazılarını — hizalar, her çizim kendi oranını korur.
- **Tek kalan çizim ortalanır**, satıra yayılmaz: dikey bir plan tam genişlikte
  çerçevede neredeyse hiç büyümez, çerçevenin çoğu beyaz kalır.
- **Metinler görsellerle aynı sol hizada.** İki kolonlu `.split`, proje
  sayfalarında tek kolona iniyor; paragraflar sayfanın beşte birinden
  başlarken görseller kenardan başlıyordu, metin görsellerle ilgisiz duruyordu.
- **Bölüm araları dar** (`clamp(2.75rem, 6vh, 5rem)`), site geri kalanından
  daha sıkı — sayfa tek bir dizi gibi okunsun diye.
- **Tek sol kenar.** Ölçümde sayfada üç tane vardı: görseller, metin ve başlık
  65 px'lik marjda, bölüm başlığı 98'de, şekil altı yazısı 96'da — ikisini de
  önlerindeki numara içeri itiyordu. Numaralar artık metnin **üstünde**
  (stüdyo sayfasındaki numaralı kolonlarla aynı kalıp), her satır aynı yerden
  başlıyor. `.chapter` düzenini değiştirirken bunu bozmayın.
- **Boşluklar CSS'te, satır içinde değil.** `zabjelo.html` elle yazılmış sayfa
  olduğu için `.dwg-pair` / `.fig` / `.split` üzerinde üç farklı `margin-top`
  değeri taşıyordu; hepsi kaldırıldı, aralar `.split + *` ve
  `.dwg-pair + .dwg-pair` kurallarından geliyor.

**Tek ölçü fotoğraf dizisi** — `.dwg-pair--uniform`. Tam genişlikteki
fotoğrafları 16:9'a kırpar, böylece aşağı inerken hepsinin yüksekliği aynı olur.
**Opsiyonel ve sadece oranları birbirine yakın setler için.** Merzifon'un dört
render'ı 1,63–1,79 arasında; 16:9 en fazla %9 yükseklik kırpıyor, sonuçta
dördü de tam olarak aynı yükseklikte (1440'ta 737 px). Panoramik setlere
**verilmemeli**: Tekirdağ'ın render'ları 2,87–3,07, Yeşilbayır'da bir tane 2,17
var — orada kırpma görüntünün beşte birini atardı, o yüzden onlar kendi
oranlarını (ve dolayısıyla farklı yüksekliklerini) koruyor. Akas'ta zaten hepsi
1,70 civarı, fark %1,5; boşuna kırpmamak için dokunulmadı.

**Tek geniş pafta** — `.dwg-pair--sheet`. Merzifon'un cephe soyutlama şeridi 5:1
oranında ve yazıları küçük; tam genişlikte, çerçevesi de paylaşılan yükseklik
yerine çizimin kendi yüksekliğinde. Yarım kolonluk standart çerçevede mürekkep
lekesi gibi kalıyordu.

**Üçlü çizim sırası** — `.dwg-pair--3`. Yeşilbayır'ın üç planı bununla tek
sırada. Çerçeve yüksekliği `--plate-h` ile üçlü sırada artıyor: iki kat planı
dikey (oran 0,65), üçer kolonda çerçeve yükseldiği için çizim küçülmüyor,
büyüyor. Genişliğe göre davranış: 62rem'in altında sıradan düzene düşüyor
(telefonda alt alta, 56–62rem arası ikili ve üçüncüsü ortalanmış), 62rem'den
itibaren üç kolon. İkili ara kademe yok — üç çizim iki kolonda son satırın
yarısını boş bırakır.

Bu sınıfın merkezleme iptali (`grid-column: auto`) bilerek merkezleme
kuralından **sonra** yazılı: iki seçicinin özgüllüğü aynı, sonra yazılan
kazanıyor. Yukarı taşınırsa üçüncü çizim ikinci satıra düşer.

**"Çizimler" diye bir bölüm açmayın.** Çizimler kendilerini anlatıyor, şekil altı
yazıları da hangi çizim olduğunu söylüyor; Yeşilbayır'daki bu başlık kaldırıldı.
Belirli bir şeyi adlandıran başlıklar (Merzifon'da Planlar, Kesit ve Görünüşler;
Tekirdağ'da Kentsel Kurgu, Kesitler) duruyor — onlar genel bir "çizim" etiketi
değil, ne olduğunu söylüyor.

**Yan yana iki paragraf** — `.text-pair`. Zabjelo'daki Doğu/Güney aksı bloğu
bununla kurulu. Satırları **subgrid**: iki başlık aynı satırı, iki paragraf da
bir sonrakini paylaşıyor, böylece bir başlık iki satıra sarıp diğeri tek satırda
kalsa bile paragraflar aynı hizadan başlıyor (gerçek durum bu). 56rem altında
alt alta yığılıyor. Satır arası boşluk yan yanayken sıfır — başlıkla paragraf
arasını paragrafın kendi `margin-top` değeri veriyor.

**Metnin yanındaki boşluk** — `.aside-pair`. Bir metin kolonu okunabilir
ölçüsünde kalıp satırın kalanını boş bıraktığında, o boşluğa ikinci bir blok
koyar. Zabjelo'da Kütle Gelişimi dizisi bununla Pasaj Kurgusu metninin yanında
duruyor: kendi bölümü yok, kolon içinde küçük bir etiket + tek satır açıklama +
oynatıcı. Üstten hizalı (`align-items: start`), yani kısa metin komşusunun
yüksekliğini sürüklemiyor. 62rem altında alt alta iniyor.

**Bölüm sırası** — görseller önce, kütle diyagramı sonra. Render bölümü sayfanın
başında (01), teknik çizimler ortada, kütle gelişim dizileri en sonda. Merzifon
sekiz bölümde iki kütle dizisi taşıyor, ikisi de sona alındı (07-08). Zabjelo'da
render'lar tematik bölümlerin içine gömülü olduğu için sıra korundu; Kütle
Gelişimi ayrı bir bölüm olmaktan çıkıp Pasaj Kurgusu'nun (02) yanına taşındı, o
yüzden sayfa beş bölüm. Yeni proje eklerken aynı sırayı tutun; bölüm numaraları
hem `<span class="num">` içinde hem HTML yorumunda geçiyor, ikisini birlikte
güncelleyin.

**Tekirdağ'da da çizim seti gösterilmiyor** — Kentsel Kurgu bölümünde yalnızca
kentsel analiz ve vaziyet planı var; siluet ve kat planları çıkarıldı, "Kesitler"
bölümü (iki kesit + cephe detayı) tamamen kaldırıldı. Genel Yaklaşım ve Kentle
Bağlantılar metinleri `.text-pair` ile yan yana; ortak bir bölüm başlığı
olmadığı için o bölüm numarasız, sayfada iki numaralı bölüm kaldı (01 Görseller,
02 Kentsel Kurgu). Sayfa çizimle değil renderla kapanıyor: avlu render'ı
(`render-05`) Görseller bölümündeki çerçeveli gruptan alınıp sona konuldu.
Kullanılmayan çizimler: `dwg-silhouette`, `dwg-plan`, `dwg-section-1..3`.

**Merzifon'da çizim seti gösterilmiyor** — yalnızca vaziyet planı ve zemin kat
planı var. Birinci/ikinci/üçüncü kat planları, üç kesit, dört görünüş ve sistem
detayları sayfadan çıkarıldı; "Kesit ve Görünüşler" bölümü tamamen kaldırıldı.
Dosyalar diskte duruyor: `assets/img/merzifon/` içinde 11 kullanılmayan çizim,
~4,8 MB (`dwg-plan-01..03`, `dwg-section-1..3`, `dwg-elev-e/n/s/w`,
`dwg-detail`).

Merzifon'un sırası: hero → **Genel Yaklaşım | Cephe Kurgusu** (yan yana) →
Cephe Soyutlaması → iki render → **Kütle Gelişimi | Kullanım Senaryoları**
(iki dizi yan yana, `.aside-pair`) → render → Planlar → render. Beş render'ın
biri hero, dördü gövdede; dördü de `.dwg-pair--uniform` taşıdığı için sayfa
boyunca aynı yükseklikte (1440'ta 737 px). "Görseller" diye ayrı bir bölüm yok,
render'lar araya serpiliyor; numaralı bölümler yalnızca 01 Cephe Soyutlaması ve
02 Planlar, iki dizi ve iki metin başlığı kolon içi etiketlerde.

İki dizi yan yanayken ikisi de aynı anda oynuyor (her biri kendi zamanlayıcısı
ve `Oynat / Durdur` düğmesiyle). Sahne oranları farklı — kütle 1500×1538,
kullanım 1600×947 — o yüzden yükseklikleri de farklı; `.aside-pair` üstten
hizalı olduğu için kısa olan öteki kolonu germiyor.

**Kullanılmayan görseller** — `assets/img/zabjelo/` içinde on dosya hiçbir
sayfada geçmiyor, toplam ~3,8 MB. Silinmediler, gerekirse geri konabilir:

- Sayfadan çıkarılanlar: `dia-facade.jpg` (cephe dolu–boş diyagramı) ve
  Çizimler bölümüyle birlikte giden `dwg-section.jpg`, `dwg-section-2.jpg`,
  `dwg-elev-front.jpg`, `dwg-elev-side.jpg`, `dwg-plan-05.jpg`.
- Hiç yerleştirilmemiş olanlar: `boulevard.jpg`, `courtyard.jpg`,
  `entrance.jpg`, `dia-section-persp-2.jpg`.

Zabjelo'da **Çizimler bölümü tamamen kaldırıldı**; sayfa dört bölüm (Vaziyet /
Pasaj / Fonksiyon / İç Mekân). Maket fotoğrafı kaldı ama artık bölüm başlığı
yok: İç Mekân'dan sonra tek başına, tam genişlikte bir görsel olarak duruyor.
Lightbox arşivi 16 görsele indi — beşinci kat planı arşivden de çıktı, çünkü
galeriyi `<main data-gallery>` içindeki görseller belirliyor.

Bu şablona uymayan tek durum küçük ya da dikey görseller: `tekirdag.html`
içindeki render-05/06/08 tam genişlikte ya aşırı büyütülür ya iki yanı boş
kalırdı, o yüzden elle `.plate` içine alındı (sıra numaraları korunarak).
Yeni proje eklerken 1300 px'den kısa ya da dikey görseller için aynısını yapın.

## Hâlâ eksik olanlar

- **İrem Demiröz Koç** — özgeçmiş ve fotoğraf gelmedi. Ekip kartı tamamen
  kaldırıldı; adı yalnızca proje künyelerinde geçiyor. Bilgi gelince `.team`
  kalıbına ikinci kart olarak eklenir.
- **Zabjelo arsa ve inşaat alanı** — raporda geçmiyor, künyede `—` duruyor.
- **Kat şeması ve kapsam** bilgileri (Zabjelo) artık gösterilmiyor; künye altı
  satırla sınırlı tutuldu.
- **Tasarım kriterleri listesi** (Zabjelo, dokuz başlık) kaldırıldı — proje
  sayfalarında böyle bir bölüm istenmiyor. Metin raporda duruyor; geri gerekirse
  `git show 9566de1:zabjelo.html` içinde `01 CONCEPT` bölümü ve `js/i18n.js`
  içindeki `z.c1.*` / `z.k1`–`z.k8` anahtarları var.
- **Kütle diyagramı açıklamaları (Zabjelo)** — `js/i18n.js` → `z.m1`–`z.m8`
  diyagramlara bakılarak yazıldı, raporda karşılıkları yok.
- **Açık adres** — gösterilmiyor. `iletisim.html` içinde yalnızca "Ankara,
  Türkiye" var; uydurma sokak/numara ve harita kaldırıldı. Gerçek adres gelince
  bir satır ve `.map-frame` kalıbıyla harita geri eklenebilir.
- **İletişim formu** hiçbir yere veri göndermiyor (`js/main.js` → `contactForm`).
  Netlify Forms / Formspree / kendi API'niz ile bağlanmalı.
- **Ödül bölümü kaldırıldı** — ofis 2026'da kurulduğu için eski tarihli bir liste
  tutarsız olurdu. Gerçek bilgi geldiğinde `.lines` kalıbıyla geri eklenebilir.
- **`noindex`** — altı sayfada arama motorlarına kapatma etiketi var. Gerçek
  içerik tamamlanıp yayına çıkarken silinmeli (HTML'lerin başında not var).

## Adlandırma notu

Yazılı metinlerde ofis adı **Demiröz & Koç Mimarlık**, logoda ise
**DEMİRÖZ & KOÇ / MİMARLIK • TASARIM**. Site logoyu görsel olarak, ofis yazısını
metin olarak kullanıyor. Kurucu adı künye belgelerinde **İrem Demiröz** yazıyor.

## Yeni proje sayfası ekleme

En zengin örnek `merzifon.html` (iki diyagram dizisi, planlar, kesitler).
`zabjelo.html` de iyi bir başlangıç.

1. Dosyayı kopyalayın, yeni ad verin.
2. Görselleri `assets/img/yeni-proje/` altına koyun, `src`'leri güncelleyin.
3. `data-i18n` anahtarlarını yeni bir önekle yeniden adlandırın, İngilizcelerini
   `js/i18n.js`'e ekleyin.
4. Künyeyi (`.spec`) doldurun, yoksa `—` bırakın.
5. `projeler.html` içine kartını ekleyin, numaraları kaydırın.
6. Alt gezinme (`.pager`) linklerini komşu projelere yönlendirin.
7. Anasayfa slaytına (`#heroSlides`) bir render eklemek isterseniz oraya da girin.

## Çok dillilik (TR / EN)

Türkçe metin doğrudan HTML içindedir — JavaScript kapalı olsa bile site okunur.
İngilizcesi `js/i18n.js` içinde `data-i18n` anahtarlarıyla eşlenir.

- Input `placeholder`'ları: `data-i18n-ph`
- Sayfa başlığı: `<body data-title-en="...">`
- Dile göre değişen görsel: `data-src-tr` / `data-src-en`
- Seçilen dil `localStorage`'da (`dk-lang`)

## Notlar

- Tüm etkileşimli öğeler klavyeyle kullanılabilir; `:focus-visible` outline verir.
- `prefers-reduced-motion` desteklenir — animasyonlar kapanır.
- Görseller `loading="lazy"`; hero hariç (`fetchpriority="high"`).
- Tek harici bağımlılık Google Fonts.
- `VERI/` klasörünü yayına yüklemeyin (~700 MB ham dosya), `.gitignore`'da.
