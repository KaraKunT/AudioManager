
class AudioManager {
  constructor(defaultPath = "") {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {}; // Yüklü sesleri saklamak için nesne
    this.isMuted = false; // Ses açık/kapalı durumu
    this.defaultPath = defaultPath; // Varsayılan dosya yolu
    this.isContextStarted = false; // AudioContext'in başlatıldığını izler
    this.masterVolume = 100; // Genel ses seviyesi (varsayılan %100)
    this.activeSources = {}; // Çalmakta olan sesleri takip etmek için nesne

    // Proxy ile eksik metot çağrıldığında sessiz hata verme
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop];
        } else {
          return () => console.warn(`Ses "${prop}" yüklenmedi veya mevcut değil.`);
        }
      },
    });
  }

  // AudioContext'i sessiz bir ses çalarak başlat
  startSilentSound() {
    if (!this.isContextStarted) {
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
      this.isContextStarted = true;
    }
  }

  // Ses dosyasını önceden yükle ve belirli bir ses seviyesi ayarla
  async sesYukle(name, src, volume = 100) {
    if (this.sounds[src]) {
      this.sounds[name] = { buffer: this.sounds[src].buffer, volume };
    } else {
      const path = this.defaultPath + src;
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[name] = { buffer: audioBuffer, volume };
      this.sounds[src] = { buffer: audioBuffer, volume };
    }
    this[name] = (vol) => this.play(name, vol);
  }

  // Aynı ses dosyasını farklı bir isimle etiketle ve ses seviyesi ayarla
  sesEtiket(newName, existingName, volume = 100) {
    if (this.sounds[existingName]) {
      this.sounds[newName] = {
        buffer: this.sounds[existingName].buffer,
        volume,
      };
      this[newName] = (vol) => this.play(newName, vol); // Etiket için de dinamik metot
    } else {
      console.warn(`Ses "${existingName}" bulunamadı.`);
    }
  }

  // Belirli bir ses seviyesinde veya geçici ses seviyesiyle ses oynatma
  play(name, tempVolume = null) {
    if (!this.isMuted && this.sounds[name]) {
      this.startSilentSound();

      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name].buffer;

      // Geçici ses seviyesi varsa, yoksa orijinal ses seviyesiyle çal
      const volume = tempVolume !== null ? tempVolume : this.sounds[name].volume;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = (this.masterVolume / 100) * (volume / 100);

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);

      // Sonradan durdurmak için kaynağı sakla
      this.activeSources[name] = source; 
    }
  }

  // Belirli bir sesi durdur
  stop(name) {
    if (this.activeSources[name]) {
      this.activeSources[name].stop(); // Sesi durdur
      delete this.activeSources[name]; // Kaynağı activeSources'den çıkar
    }
  }

  // Genel ses seviyesini ayarla
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(100, volume)); // 0 ile 100 arasında sınırla
    console.log(`Genel ses seviyesi ayarlandı: %${this.masterVolume}`);
  }

  // Tüm sesleri kapatma
  mute() {
    this.isMuted = true;
    console.log("Sesler kapatıldı");
  }

  // Tüm sesleri açma
  unmute() {
    this.isMuted = false;
    console.log("Sesler açıldı");
  }

  // Sesleri açma/kapatma durumunu değiştirme
  toggleMute() {
    this.isMuted = !this.isMuted;
    console.log(this.isMuted ? "Sesler kapatıldı" : "Sesler açıldı");
  }
}
