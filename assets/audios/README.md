# 🎵 Arquivos de Áudio - EduVoice

## 📁 Estrutura

Esta pasta contém todos os arquivos de áudio utilizados no sistema interativo do EduVoice.

### Background Music (Trilhas de Fundo)

**Localização:** `assets/audios/background/`

- `quiz-theme-1.mp3` - Trilha calma (tela inicial / resultado baixo)
- `quiz-theme-2.mp3` - Trilha focada (durante o quiz)
- `quiz-theme-3.mp3` - Trilha energética (resultado alto)

**Especificações:**

- Formato: MP3 (128kbps)
- Duração: ~2 minutos (loop)
- Volume recomendado: 30%

### Sound Effects (Efeitos Sonoros)

**Localização:** `assets/audios/effects/`

- `correct.mp3` - Som de resposta correta
- `incorrect.mp3` - Som de resposta incorreta
- `click.mp3` - Som de clique/seleção
- `success.mp3` - Som de conclusão do quiz
- `next-question.mp3` - Som de transição entre perguntas

**Especificações:**

- Formato: MP3 (128kbps)
- Duração: <2 segundos
- Volume recomendado: 50%

## 🎨 Como Obter os Áudios

### Opção 1: Sites Gratuitos (CC0/Royalty-Free)

**Música de Fundo:**

- [Incompetech](https://incompetech.com/) - Kevin MacLeod
- [Bensound](https://www.bensound.com/)
- [YouTube Audio Library](https://studio.youtube.com/channel/UCxxxxxxxxxxx/music)

**Efeitos Sonoros:**

- [Freesound](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [Mixkit](https://mixkit.co/free-sound-effects/)

### Opção 2: Gerar com IA

**Música:**

- [Soundraw](https://soundraw.io/)
- [AIVA](https://www.aiva.ai/)
- [Mubert](https://mubert.com/)

**Efeitos:**

- [ElevenLabs Sound Effects](https://elevenlabs.io/)
- [AudioGen](https://felixkreuk.github.io/audiogen/)

### Opção 3: Criar Manualmente

**Ferramentas:**

- Audacity (gratuito)
- GarageBand (Mac)
- FL Studio (Windows)

## 📝 Orientações para Seleção

### Trilha 1 (Calma)

- BPM: 60-80
- Estilo: Ambient, Piano, Chill
- Emoção: Relaxante, acolhedora

### Trilha 2 (Focada)

- BPM: 80-100
- Estilo: Lo-fi, Minimal, Instrumental
- Emoção: Concentração, produtividade

### Trilha 3 (Energética)

- BPM: 120-140
- Estilo: Upbeat, Motivacional
- Emoção: Celebração, vitória

## ⚙️ Otimização

Após baixar os arquivos, otimize-os:

```bash
# Converter para MP3 128kbps
ffmpeg -i input.wav -b:a 128k output.mp3

# Normalizar volume
ffmpeg -i input.mp3 -af "loudnorm" output.mp3

# Cortar silêncio
ffmpeg -i input.mp3 -af "silenceremove=start_periods=1" output.mp3
```

## 🚀 Status de Implementação

- [x] Estrutura de pastas criada
- [ ] Trilha 1 adicionada
- [ ] Trilha 2 adicionada
- [ ] Trilha 3 adicionada
- [ ] Efeito "correct" adicionado
- [ ] Efeito "incorrect" adicionado
- [ ] Efeito "click" adicionado
- [ ] Efeito "success" adicionado
- [ ] Efeito "next-question" adicionado

## 📄 Licença

Certifique-se de que todos os áudios utilizados sejam:

- CC0 (domínio público)
- CC-BY (com atribuição)
- Royalty-Free com licença comercial

Mantenha um arquivo `AUDIO_CREDITS.md` com as atribuições necessárias.
