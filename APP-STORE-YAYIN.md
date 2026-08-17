# App Store'da Yayinlama

Bu akista Windows'tan EAS Build ve EAS Submit kullanilir. Mac gerekmez.

## Bir kere yapilacak hazirlik

1. Apple Developer Program hesabin aktif olsun.
2. App Store Connect'te yeni app kaydi olustur.
3. App kaydinda bunlari kullan:
   - Platform: iOS
   - Name: Zikr Defteri
   - Bundle ID: `com.esref.zikrdefteri`
   - SKU: `zikr-defteri-ios`
   - Primary language: Turkish veya English
4. App Privacy bolumunde gizlilik politikasini ve veri toplama cevaplarini doldur.
5. App Store sayfasi icin aciklama, kategori, yas derecelendirmesi ve ekran goruntulerini hazirla.

## Build edip TestFlight'a yukleme

```powershell
npm run build:ios-production
```

veya dosyaya cift tikla:

```text
Zikr-AppStore-Yayinla.cmd
```

Bu komut:

- TypeScript kontrolu yapar.
- Expo hesabina giris kontrolu yapar.
- EAS production iOS build baslatir.
- Build bitince App Store Connect/TestFlight'a yukler.

## Sadece son build'i yeniden gonderme

```powershell
npm run submit:ios
```

veya:

```text
Zikr-AppStore-Son-Build-Gonder.cmd
```

## App Review'a gonderme

EAS Submit build'i App Store Connect'e yukler. Apple'in herkese acik App Store incelemesine gondermek icin App Store Connect web panelinde:

1. Apps > Zikr Defteri > App Store sekmesine git.
2. Metadata, ekran goruntuleri, fiyat/availability, privacy ve age rating alanlarini tamamla.
3. Islenen build'i sec.
4. Submit for Review'a bas.

Build TestFlight'ta gorunmeden once Apple tarafinda genelde 10-15 dakika islenir.
