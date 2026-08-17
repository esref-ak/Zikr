# Gercek iPhone Uygulamasi

Bu yol Expo Go veya web app degildir. EAS Build ile imzali iOS `.ipa` uretilir ve iPhone'a gercek uygulama olarak kurulur.

## Gerekenler

- Expo hesabi.
- Apple Developer Program hesabi.
- iPhone'un UDID kaydi.

## En pratik kurulum

1. `Zikr-iPhone-Gercek-Uygulama-Build.cmd` dosyasini ac.
2. Uyariyi okuyup devam etmek istiyorsan `Evet` yaz.
3. Expo hesabina giris yap.
4. Cikan cihaz kayit QR/linkini iPhone'da ac.
5. Cihaz kaydi bitince terminaldeki adimlarla iOS `preview` build'i baslat.
6. Build bitince Expo dashboard veya terminaldeki `Install` linkini iPhone'da ac.

## Komutla calistirma

```powershell
npm run build:iphone-native
```

## Notlar

- `preview` profili cihazina kurulabilir internal build uretir.
- `production` profili App Store/TestFlight icindir; dogrudan cihaza kurulmaz.
- Yeni kaydedilen iPhone icin bazi Apple hesaplarinda provisioning islemi 24-72 saate kadar bekletebilir.
