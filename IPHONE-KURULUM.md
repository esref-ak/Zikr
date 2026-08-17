# iPhone'a Uygulama Gibi Yukleme

En kolay yol Apple Developer hesabi istemeyen web app yoludur.

## Yerel deneme

Uyari: Bu yol yerel ag IP adresi kullanir. Sirket, okul, kafe veya ortak Wi-Fi aglarinda kullanmadan once agin guvenilir oldugundan emin ol.

1. `Zikr-iPhone-Uygulama-Ekle.cmd` dosyasini ac.
2. iPhone ve bilgisayar ayni Wi-Fi aginda olsun.
3. Pencerede yazan `http://...:8082` adresini iPhone Safari'de ac.
4. Safari'de Paylas > Ana Ekrana Ekle sec.
5. Varsa `Open as Web App` acik kalsin, sonra Ekle'ye bas.

Bu yol hizlidir ama adres bilgisayar ve web sunucusu acikken calisir.

## Kalici kurulum

1. Web paketini uret:

```powershell
npm run build:web
```

2. Derleme sonunda PWA dosyalari `dist` klasorune otomatik kopyalanir.
3. Olusan `dist` klasorunu HTTPS destekleyen bir hostinge yayinla.
4. iPhone Safari'de yayin adresini ac.
5. Paylas > Ana Ekrana Ekle > Ekle.

Bu sekilde iPhone ana ekraninda Zikr ikonu olur ve uygulama Safari cubugu olmadan acilir.

## Gercek native iOS uygulamasi

Gercek `.ipa`, TestFlight veya App Store kurulumu icin Apple Developer Program gerekir. Bu yol icin EAS Build kullanilir:

```powershell
npx eas-cli build --platform ios
```

Apple tarafi ucretli oldugu ve cihaz/profil bilgisi gerektirdigi icin en pratik ilk kurulum PWA yoludur.
