# Zikr Defteri

Zikr Defteri, Expo ve React Native ile hazırlanmış mobil zikir uygulamasıdır. Hazır zikirler, ayet/dua kayıtları, Esmâü'l-Hüsna listesi, sayaç ve kişinin kendi zikir/ayet ekleyebileceği kalıcı kayıt alanı içerir.

## Kurulan Geliştirme Araçları

- Node.js LTS kuruldu.
- Expo tabanlı React Native projesi oluşturuldu.
- Ek paketler:
  - `@react-native-async-storage/async-storage`: Kişisel kayıtları telefonda saklar.
  - `expo-linear-gradient`: Arayüzde yumuşak renk geçişleri sağlar.
  - `@expo/vector-icons`: Alt menü ve kart ikonlarını sağlar.
  - `react-native-safe-area-context`: Telefon çentik/status bar alanlarını güvenli yönetir.
  - `react-dom`, `react-native-web`, `@expo/metro-runtime`: Android/iOS emülatöre takılmadan web önizleme açmayı sağlar.

## Çalıştırma

Bu projede VS Code'un `Run and Debug` / yeşil play düğmesini kullanma. O bölüm bazı eklentiler yüzünden iOS debugger açmaya çalışabilir ve Windows'ta `ios_webkit_debug_proxy` hatası verir.

Kullanılacak yollar:

- Mobil web önizleme: `Zikr-Web-Ac.cmd`
- iPhone QR: `Zikr-iPhone-Ac.cmd`
- Arkadaşa QR gönderme: `Zikr-Arkadasa-Gonder.cmd`
- VS Code içinden hızlı web: `Ctrl + Shift + B`

### iPhone'da Deneme

Bu proje iOS'ta kullanılacaksa Windows üzerindeki en kolay test yolu gerçek iPhone + Expo Go'dur. Windows'ta iOS Simulator çalışmaz; iOS Simulator için Mac ve Xcode gerekir.

1. iPhone'a App Store'dan `Expo Go` yükle.
2. VS Code içinde `Ctrl + Shift + B` tuşuna bas veya `Zikr-iPhone-Ac.cmd` dosyasını çalıştır.
3. Terminalde çıkan QR kodu iPhone'un Kamera uygulamasıyla okut.
4. Terminal penceresini açık bırak.

Aynı işlemi Windows Explorer'dan çift tıklayarak da başlatabilirsin:

```text
Zikr-iPhone-Ac.cmd
```

Terminal komutu:

```powershell
npm run open:iphone
```

VS Code veya NPM panelinde yanlışlıkla `ios` scriptini çalıştırırsan da aynı QR akışı başlar:

```powershell
npm run ios
```

Bu kısayol tunnel modunda açılır. Bu sayede telefon aynı Wi-Fi ağında olmasa bile bağlanma ihtimali daha yüksektir.

### Arkadaşa Telefondan Kontrol Ettirme

Arkadaşın yanında değilse en kolay yol tunnel modudur:

```text
Zikr-Arkadasa-Gonder.cmd
```

veya:

```powershell
npm run share:iphone
```

Bu pencere açık kalırken terminalde çıkan QR kodun ekran görüntüsünü arkadaşına gönder. Arkadaşın iPhone'a `Expo Go` yükler ve QR kodu iPhone Kamera uygulamasıyla okutur. Bilgisayar kapanırsa veya terminal kapatılırsa bağlantı da kapanır.

### Hızlı Web Önizleme

Tasarımı hızlı görmek için Android Studio veya iPhone gerekmeden web önizleme açabilirsin:

```text
Zikr-Web-Ac.cmd
```

veya:

```powershell
npm run open:web
```

Bu yöntem `http://localhost:8082` adresini küçük telefon boyutlu ayrı bir pencerede açar. Web önizleme ayrıca bilgisayarda telefon genişliğinde, yaklaşık iPhone boyutunda bir çerçeve içinde görünür.

VS Code'da `Ctrl + Shift + B` artık web önizlemeyi açar. `Run and Debug` panelindeki tek seçenek de `Zikr Defteri - Web Ac` olacak şekilde ayarlandı; iOS debug attach kullanılmaz.

### Android

Android emülatör artık ana test yolu değildir, ama gerekirse duruyor:

```powershell
npm run open:android
```

TypeScript kontrolü:

```powershell
npm run typecheck
```

## Ana Özellikler

- Ana sayfa: Günlük giriş alanı, aktif sayaç, hızlı geçiş kartları ve öne çıkan zikirler.
- Sayaç: Seçili zikir/dua/ayet için hedefli sayaç, kalıcı toplam çekim sayısı, hızlı hedef seçimi, sıfırlama, azaltma ve `+10` artırma.
- Kütüphane: Hazır zikirler, dualar, ayetler ve kişisel kayıtlar için arama ve filtreleme.
- Esmâü'l-Hüsna: 99 isim, Arapça yazım, okunuş ve kısa Türkçe anlam.
- Kendi Defterim: Zikir, dua veya ayet ekleme; kayıtlar AsyncStorage ile kalıcı saklanır.

## Kod Alanları

`App.tsx`

Uygulamanın ana kabuğudur. Aktif sekme, aktif sayaç içeriği ve kişisel kayıtlar burada birleştirilir. Yeni bir ekran eklemek istersen önce `TabKey` tipini genişletip sonra bu dosyadaki `renderScreen` içine ekle.

`src/types.ts`

Uygulamadaki ortak TypeScript tipleri burada durur. Zikir, dua, ayet, Esmâ ve kişisel kayıt yapıları buradan yönetilir.

`src/theme.ts`

Renkler, boşluk ölçüleri, köşe yuvarlaklıkları ve gölge ayarları burada tanımlıdır. Genel tasarım dilini değiştirmek için ilk bakılacak dosyadır.

`src/data/presets.ts`

Hazır içerik havuzudur:

- `READY_ZIKR`: Hazır zikirler.
- `AYAH_DUA_LIBRARY`: Hazır ayet ve dua kayıtları.
- `ESMA_UL_HUSNA`: 99 Esmâü'l-Hüsna kaydı.

Yeni hazır zikir veya ayet eklemek için bu dizilere aynı obje yapısıyla yeni kayıt ekleyebilirsin.

`src/storage/customItems.ts`

Kişisel kayıtları AsyncStorage içine okur ve yazar. Kalıcı kayıt anahtarı burada tanımlıdır.

`src/storage/counterTotals.ts`

Her zikir/dua/ayet için toplam çekim sayılarını AsyncStorage içine okur ve yazar. Seans sayacı sıfırlansa bile bu toplamlar korunur.

`src/hooks/useCustomItems.ts`

Kişisel kayıt ekleme, silme, yükleme ve kaydetme işlerini yönetir. Formdan gelen veriler bu hook üzerinden saklanır.

`src/hooks/useCounterTotals.ts`

Sayaçtaki toplam çekim sayılarını yönetir. `Zikret` ve `+10` toplamı artırır; `-` yanlış basımı geri alır; sıfırlama toplamı değiştirmez.

`src/components/BottomTabs.tsx`

Alt sekme menüsüdür. Sekme ikonları ve etiketleri burada tanımlıdır.

`src/components/ScreenHeader.tsx`

Ekranların üst başlık bileşenidir.

`src/components/SectionCard.tsx`

Ana sayfadaki hızlı geçiş kartları için kullanılır.

`src/components/PracticeCard.tsx`

Zikir, dua, ayet ve kişisel kayıt kartıdır. Kütüphane, sayaç seçim listesi ve kişisel kayıt listesinde tekrar kullanılır.

`src/components/EmptyState.tsx`

Liste boş olduğunda gösterilen ortak boş durum bileşenidir.

`src/screens/HomeScreen.tsx`

Ana sayfa ekranıdır. Hızlı geçişler, öne çıkan zikirler ve uygulama özetleri burada görünür.

`src/screens/CounterScreen.tsx`

Sayaç ekranıdır. Hedef, ilerleme çubuğu, toplam çekim alanı, büyük zikir butonu ve sayaç aksiyonları burada yönetilir.

`src/screens/LibraryScreen.tsx`

Hazır ve kişisel içerik kütüphanesidir. Arama ve kategori filtreleri burada çalışır.

`src/screens/AsmaScreen.tsx`

Esmâü'l-Hüsna liste ekranıdır. Arama yapabilir ve seçilen Esmâ’yı sayaçta açabilirsin.

`src/screens/CustomScreen.tsx`

Kişisel zikir, dua ve ayet ekleme ekranıdır. Form doğrulaması, kayıt oluşturma ve silme onayı burada bulunur.

`app.json`

Expo uygulama adı, ikonları, Android ayarları ve genel uygulama konfigürasyonu burada tutulur.

`package.json`

Projede kullanılan paketler ve komutlar burada bulunur.

## Yeni İçerik Ekleme Örneği

`src/data/presets.ts` içinde `READY_ZIKR` dizisine yeni kayıt ekleyebilirsin:

```ts
{
  id: 'zikr-yeni-kayit',
  title: 'Yeni Zikir',
  arabic: '...',
  latin: '...',
  meaning: '...',
  note: 'Kısa not',
  target: 99,
  category: 'zikr',
  source: 'preset',
}
```

## Geliştirme Notu

`npm audit fix` kırıcı olmayan şekilde çalıştırıldı. Kalan audit uyarıları Expo/Metro zincirinden geliyor; npm bunlar için `--force` ile Expo sürümünü geriye çekmeyi önerdiği için uygulanmadı.
