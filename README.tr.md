# AudioManager

`AudioManager`, JavaScript ile ses dosyalarını yönetmek için geliştirilmiş, esnek ve güçlü bir sınıftır. Bu sınıf, her bir ses için ayrı ses seviyesi, genel ses seviyesi, sessize alma ve yeniden oynatma özellikleri sağlar. Aynı ses dosyasını farklı etiketlerle farklı ses seviyelerinde kullanabilirsiniz.

## Özellikler
- **Ses yükleme ve oynatma**: Ses dosyalarını yükleyebilir ve belirli bir ses seviyesinde oynatabilirsiniz.
- **Etiketleme**: Aynı ses dosyasını farklı etiketlerle farklı ses seviyelerinde kullanabilirsiniz.
- **Genel ses seviyesi**: Tüm sesler için genel bir ses seviyesi ayarlayabilirsiniz.
- **Geçici ses seviyesi**: Belirli bir çalma işlemi için geçici ses seviyesi verebilirsiniz.
- **Sessize alma ve ses açma**: Tüm sesleri sessize alabilir veya açabilirsiniz.

## Kurulum

1. Projeye `AudioManager.js` dosyasını ekleyin veya aşağıdaki kodu kendi dosyanıza ekleyin.
2. Sınıfı kullanmak için `AudioManager`'ı çağırarak yeni bir ses yöneticisi oluşturun.

## Kullanım

### Global Ses Yöneticisi Örneği

Aşağıda, `AudioManager`'ı global bir ses yöneticisi olarak kullanarak sesleri nasıl yükleyeceğinizi ve etiketleyeceğinizi gösteren bir örnek bulunmaktadır.

```javascript
let audioManager = null;

// Sayfa yüklendikten sonra ses yöneticisini başlat
document.addEventListener("DOMContentLoaded", async function () {
  // Global bir ses yolu belirleyin
  const globalSoundPath = "https://www.example.com/sounds/";

  // AudioManager'ı başlatın
  audioManager = new AudioManager(globalSoundPath);

  // Farklı sesleri yükleyin
  await audioManager.sesYukle("menuClick", "menu_click.wav", 100); // %100 sesle yükle
  await audioManager.sesYukle("itemSelect", "item_select.wav", 80); // %80 sesle yükle

  // Mevcut bir sesi farklı isimlerle etiketleyin
  audioManager.sesEtiket("openTab", "menuClick", 70);    // %70 sesle "menuClick" olarak
  audioManager.sesEtiket("clickItem", "itemSelect", 60); // %60 sesle "itemSelect" olarak

  // Sesleri test edin
  audioManager.menuClick();  // %100 sesle çalınır
  audioManager.itemSelect(); // %80 sesle çalınır
  audioManager.openTab();    // %70 sesle çalınır
  audioManager.clickItem();  // %60 sesle çalınır

  audioManager.play("menuClick");  // %100 sesle çalınır
  audioManager.play("itemSelect"); // %80 sesle çalınır
  audioManager.play("openTab");    // %70 sesle çalınır
  audioManager.play("clickItem");  // %60 sesle çalınır

  // Genel ses seviyesini ayarlayın
  audioManager.setMasterVolume(50); // Genel ses %50 olur
});
```

### Örnek Kullanım Senaryoları

- **Ses Yükleme ve Oynatma**:
  ```javascript
  audioManager.sesYukle("clickSound", "button_click.wav", 90); // %90 ses seviyesinde yükle
  audioManager.clickSound(); // %90 ses seviyesinde oynatır 
  ```

- **Etiketleme**:
  ```javascript
  audioManager.sesEtiket("secondaryClick", "clickSound", 60); // %60 sesle farklı bir etiket
  audioManager.secondaryClick();       // %60 ses seviyesinde oynar
  audioManager.play("secondaryClick"); // %60 ses seviyesinde oynar
  ```

- **Geçici Ses Seviyesi ile Oynatma**:
  ```javascript
  audioManager.clickSound(30);         // Bir defalığına %30 sesle çalınır
  audioManager.play("clickSound", 30); // Bir defalığına %30 sesle çalınır
  ```

- **Genel Ses Seviyesini Ayarlama**:
  ```javascript
  audioManager.setMasterVolume(40); // Genel sesi %40’a ayarlar, tüm sesler bu orana göre oynatılır
  ```

- **Sessize Alma ve Açma**:
  ```javascript
  audioManager.mute();   // Tüm sesler sessize alınır
  audioManager.unmute(); // Tüm sesler açılır
  ```
