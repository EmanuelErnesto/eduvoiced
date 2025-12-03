class AudioManager {
  constructor() {
    this.audioContext = null;
    this.backgroundMusic = null;
    this.backgroundSource = null;
    this.effects = {};
    this.isInitialized = false;
    this.isPlaying = false;

    this.volume = {
      music: 0.3,
      effects: 0.5,
    };

    this.tracks = {
      1: "assets/audios/background/quiz-theme-1.mp3",
      2: "assets/audios/background/quiz-theme-2.mp3",
      3: "assets/audios/background/quiz-theme-3.mp3",
    };

    this.currentTrack = 1;

    this.loadSettings();
  }

  async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      await this.loadEffects();

      this.isInitialized = true;
      console.log("✅ AudioManager inicializado");
      return true;
    } catch (error) {
      console.error("❌ Erro ao inicializar AudioManager:", error);
      return false;
    }
  }

  async loadEffects() {
    const effectsToLoad = {
      correct: "assets/audios/effects/correct.mp3",
      incorrect: "assets/audios/effects/incorrect.mp3",
      click: "assets/audios/effects/click.mp3",
      success: "assets/audios/effects/success.mp3",
      nextQuestion: "assets/audios/effects/next-question.mp3",
    };

    for (const [name, path] of Object.entries(effectsToLoad)) {
      try {
        const audio = new Audio(path);
        audio.volume = this.volume.effects;
        audio.preload = "auto";
        this.effects[name] = audio;
      } catch (error) {
        console.warn(`⚠️ Não foi possível carregar efeito: ${name}`, error);
      }
    }
  }

  async loadBackgroundMusic(trackNumber = 1) {
    if (!this.isInitialized) {
      await this.init();
    }

    const trackPath = this.tracks[trackNumber];
    if (!trackPath) {
      console.error("❌ Trilha não encontrada:", trackNumber);
      return false;
    }

    try {
      if (this.backgroundMusic) {
        this.stopBackground();
      }

      this.backgroundMusic = new Audio(trackPath);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.volume.music;

      this.currentTrack = trackNumber;
      console.log(`🎵 Trilha ${trackNumber} carregada`);
      return true;
    } catch (error) {
      console.error("❌ Erro ao carregar trilha:", error);
      return false;
    }
  }

  async playBackground() {
    if (!this.backgroundMusic) {
      await this.loadBackgroundMusic(this.currentTrack);
    }

    if (this.backgroundMusic && !this.isPlaying) {
      try {
        await this.backgroundMusic.play();
        this.isPlaying = true;
        console.log("▶️ Música de fundo iniciada");
        return true;
      } catch (error) {
        console.warn(
          "⚠️ Autoplay bloqueado. Aguardando interação do usuário.",
          error
        );
        return false;
      }
    }
  }

  pauseBackground() {
    if (this.backgroundMusic && this.isPlaying) {
      this.backgroundMusic.pause();
      this.isPlaying = false;
      console.log("⏸️ Música pausada");
    }
  }

  resumeBackground() {
    if (this.backgroundMusic && !this.isPlaying) {
      this.backgroundMusic.play();
      this.isPlaying = true;
      console.log("▶️ Música retomada");
    }
  }

  stopBackground() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.isPlaying = false;
      console.log("⏹️ Música parada");
    }
  }

  async changeTrack(trackNumber, autoPlay = true) {
    await this.loadBackgroundMusic(trackNumber);
    if (autoPlay) {
      await this.playBackground();
    }
  }

  playEffect(effectName) {
    const effect = this.effects[effectName];
    if (effect) {
      const clone = effect.cloneNode();
      clone.volume = this.volume.effects;
      clone
        .play()
        .catch((err) =>
          console.warn(`⚠️ Erro ao tocar efeito ${effectName}:`, err)
        );
    } else {
      console.warn(`⚠️ Efeito não encontrado: ${effectName}`);
    }
  }

  setVolume(type, value) {
    const normalizedValue = Math.max(0, Math.min(100, value)) / 100;

    if (type === "music") {
      this.volume.music = normalizedValue;
      if (this.backgroundMusic) {
        this.backgroundMusic.volume = normalizedValue;
      }
    } else if (type === "effects") {
      this.volume.effects = normalizedValue;
      Object.values(this.effects).forEach((effect) => {
        effect.volume = normalizedValue;
      });
    }

    this.saveSettings();
    console.log(`🔊 Volume ${type}: ${value}%`);
  }

  toggleMute() {
    const isMuted = this.volume.music === 0 && this.volume.effects === 0;

    if (isMuted) {
      this.setVolume("music", 30);
      this.setVolume("effects", 50);
    } else {
      this.setVolume("music", 0);
      this.setVolume("effects", 0);
    }

    return !isMuted;
  }

  fadeIn(duration = 2000) {
    if (!this.backgroundMusic) return;

    const targetVolume = this.volume.music;
    const steps = 50;
    const increment = targetVolume / steps;
    const stepDuration = duration / steps;

    this.backgroundMusic.volume = 0;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        this.backgroundMusic.volume = targetVolume;
      } else {
        this.backgroundMusic.volume = increment * currentStep;
        currentStep++;
      }
    }, stepDuration);
  }

  fadeOut(duration = 2000) {
    if (!this.backgroundMusic) return;

    const initialVolume = this.backgroundMusic.volume;
    const steps = 50;
    const decrement = initialVolume / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        this.pauseBackground();
        this.backgroundMusic.volume = this.volume.music;
      } else {
        this.backgroundMusic.volume = initialVolume - decrement * currentStep;
        currentStep++;
      }
    }, stepDuration);
  }

  saveSettings() {
    const settings = {
      musicVolume: this.volume.music * 100,
      effectsVolume: this.volume.effects * 100,
      currentTrack: this.currentTrack,
    };
    localStorage.setItem("eduvoice_audio_settings", JSON.stringify(settings));
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem("eduvoice_audio_settings");
      if (saved) {
        const settings = JSON.parse(saved);
        this.volume.music = (settings.musicVolume || 30) / 100;
        this.volume.effects = (settings.effectsVolume || 50) / 100;
        this.currentTrack = settings.currentTrack || 1;
      }
    } catch (error) {
      console.warn("⚠️ Erro ao carregar configurações de áudio:", error);
    }
  }

  destroy() {
    this.stopBackground();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.backgroundMusic = null;
    this.effects = {};
    this.isInitialized = false;
    console.log("🗑️ AudioManager destruído");
  }
}

window.audioManager = new AudioManager();

document.addEventListener(
  "click",
  function initAudioOnFirstClick() {
    window.audioManager.init();
    document.removeEventListener("click", initAudioOnFirstClick);
  },
  { once: true }
);

console.log("🎵 AudioManager carregado");
