class AudioManager {
  constructor(defaultPath = "") {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {}; // Object to store loaded sounds
    this.isMuted = false; // Mute/unmute status
    this.defaultPath = defaultPath; // Default path for audio files
    this.isContextStarted = false; // Track if AudioContext has been started
    this.masterVolume = 100; // Global volume level (default is 100%)
    this.activeSources = {}; // Track active sources to stop sounds

    // Use Proxy to suppress errors when calling undefined methods
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop];
        } else {
          return () => console.warn(`Sound "${prop}" is not loaded or does not exist.`);
        }
      },
    });
  }

  // Start AudioContext by playing a silent sound
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

  // Load an audio file and set its volume level
  async loadSound(name, src, volume = 100) {
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

  // Tag the same audio file with a different name and set volume level
  tagSound(newName, existingName, volume = 100) {
    if (this.sounds[existingName]) {
      this.sounds[newName] = {
        buffer: this.sounds[existingName].buffer,
        volume,
      };
      this[newName] = (vol) => this.play(newName, vol); // Dynamic method for the tag
    } else {
      console.warn(`Sound "${existingName}" not found.`);
    }
  }

  // Play sound at a specific volume level, or with a temporary volume
  play(name, tempVolume = null) {
    if (!this.isMuted && this.sounds[name]) {
      this.startSilentSound();

      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name].buffer;

      // Use temporary volume if provided, otherwise use the original volume
      const volume = tempVolume !== null ? tempVolume : this.sounds[name].volume;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = (this.masterVolume / 100) * (volume / 100);

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start(0);
      
      // Save the source to allow stopping later
      this.activeSources[name] = source;

      // Remove from activeSources when the sound finishes playing
      source.onended = () => {
        delete this.activeSources[name];
      };
    }
  }

  // Stop playing a specific sound
  stop(name) {
    if (this.activeSources[name]) {
      this.activeSources[name].stop(); // Stop the sound
      delete this.activeSources[name]; // Remove it from active sources
    }
  }

  // Set global volume level
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(100, volume)); // Restrict between 0 and 100
    console.log(`Global volume set to: %${this.masterVolume}`);
  }

  // Mute all sounds
  mute() {
    this.isMuted = true;
    console.log("All sounds muted");
  }

  // Unmute all sounds
  unmute() {
    this.isMuted = false;
    console.log("All sounds unmuted");
  }

  // Toggle mute/unmute status
  toggleMute() {
    this.isMuted = !this.isMuted;
    console.log(this.isMuted ? "All sounds muted" : "All sounds unmuted");
  }
}
