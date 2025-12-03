class VoiceManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.queue = [];

    this.settings = {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      lang: "pt-BR",
    };

    this.loadSettings();

    this.init();
  }

  init() {
    this.loadVoices();

    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.loadVoices();
      };
    }

    console.log("🗣️ VoiceManager inicializado");
  }

  loadVoices() {
    this.voices = this.synth.getVoices();

    const ptBRVoices = this.voices.filter((voice) => voice.lang === "pt-BR");
    const ptVoices = this.voices.filter((voice) => voice.lang.startsWith("pt"));

    if (ptBRVoices.length > 0) {
      this.currentVoice = ptBRVoices[0];
      console.log("✅ Voz PT-BR encontrada:", this.currentVoice.name);
    } else if (ptVoices.length > 0) {
      this.currentVoice = ptVoices[0];
      console.log("✅ Voz PT encontrada:", this.currentVoice.name);
    } else {
      this.currentVoice = this.voices[0];
      console.warn(
        "⚠️ Nenhuma voz PT encontrada. Usando:",
        this.currentVoice?.name
      );
    }
  }

  getAvailableVoices() {
    return this.voices.filter(
      (voice) => voice.lang.startsWith("pt") || voice.lang === "pt-BR"
    );
  }

  setVoice(voiceName) {
    const voice = this.voices.find((v) => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
      this.saveSettings();
      console.log("🎤 Voz alterada para:", voiceName);
      return true;
    }
    console.warn("⚠️ Voz não encontrada:", voiceName);
    return false;
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!text || text.trim().length === 0) {
        reject(new Error("Texto vazio"));
        return;
      }

      if (options.interrupt) {
        this.stop();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.voice = this.currentVoice;
      utterance.rate = options.rate || this.settings.rate;
      utterance.pitch = options.pitch || this.settings.pitch;
      utterance.volume = options.volume || this.settings.volume;
      utterance.lang = options.lang || this.settings.lang;

      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log("🗣️ Narrando:", text.substring(0, 50) + "...");
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        console.log("✅ Narração concluída");
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error("❌ Erro na narração:", event.error);
        reject(event);
      };

      this.synth.speak(utterance);
    });
  }

  async speakWithHighlight(text, element) {
    if (element) {
      element.classList.add("speaking");
    }

    try {
      await this.speak(text);
    } finally {
      if (element) {
        element.classList.remove("speaking");
      }
    }
  }

  async speakSequence(texts, pauseBetween = 300) {
    for (const text of texts) {
      await this.speak(text);
      if (pauseBetween > 0) {
        await this.sleep(pauseBetween);
      }
    }
  }

  pause() {
    if (this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      console.log("⏸️ Narração pausada");
    }
  }

  resume() {
    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      console.log("▶️ Narração retomada");
    }
  }

  stop() {
    if (this.isSpeaking || this.isPaused) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      console.log("⏹️ Narração parada");
    }
  }

  isCurrentlySpeaking() {
    return this.isSpeaking || this.synth.speaking;
  }

  setRate(rate) {
    this.settings.rate = Math.max(0.1, Math.min(10, rate));
    this.saveSettings();
    console.log("⚡ Velocidade da voz:", this.settings.rate);
  }

  setPitch(pitch) {
    this.settings.pitch = Math.max(0, Math.min(2, pitch));
    this.saveSettings();
    console.log("🎵 Tom da voz:", this.settings.pitch);
  }

  setVolume(volume) {
    this.settings.volume = Math.max(0, Math.min(100, volume)) / 100;
    this.saveSettings();
    console.log("🔊 Volume da voz:", volume + "%");
  }

  getSettings() {
    return {
      ...this.settings,
      voiceName: this.currentVoice?.name,
      availableVoices: this.getAvailableVoices().map((v) => ({
        name: v.name,
        lang: v.lang,
      })),
    };
  }

  saveSettings() {
    const settings = {
      rate: this.settings.rate,
      pitch: this.settings.pitch,
      volume: this.settings.volume * 100,
      voiceName: this.currentVoice?.name,
    };
    localStorage.setItem("eduvoice_voice_settings", JSON.stringify(settings));
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem("eduvoice_voice_settings");
      if (saved) {
        const settings = JSON.parse(saved);
        this.settings.rate = settings.rate || 0.9;
        this.settings.pitch = settings.pitch || 1.0;
        this.settings.volume = (settings.volume || 80) / 100;

        if (settings.voiceName) {
          setTimeout(() => this.setVoice(settings.voiceName), 100);
        }
      }
    } catch (error) {
      console.warn("⚠️ Erro ao carregar configurações de voz:", error);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  test() {
    this.speak(
      "Olá! Eu sou o assistente de voz do EduVoice. Estou pronto para narrar suas perguntas e dar feedback durante o quiz."
    );
  }
}

window.voiceManager = new VoiceManager();

console.log("🎤 VoiceManager carregado");
