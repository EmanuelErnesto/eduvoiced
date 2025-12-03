# EduVoice - Sistema de Quiz Interativo com IA

<div align="center">

![EduVoice Logo](assets/images/logo.png)

**Aplicação de geração de quizzes interativos com experiência fluida e dinâmica**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📋 Sobre o Projeto

**EduVoice** é uma aplicação web inovadora que utiliza inteligência artificial para gerar quizzes personalizados sobre qualquer tema. Com uma interface moderna e responsiva, o projeto combina animações suaves, design intuitivo e tecnologia de ponta para proporcionar uma experiência de aprendizado envolvente.

### ✨ Características Principais

- 🤖 **Geração Automática via IA**: Utiliza a API do Google Gemini para criar 10 perguntas únicas sobre qualquer tema
- 📱 **Totalmente Responsivo**: Design adaptável para mobile (375px), tablet (768px) e desktop (1024px+)
- 🎨 **Interface Moderna**: Animações CSS suaves e transições fluidas
- 🎥 **Vídeo Background**: Página inicial com vídeo incorporado para experiência imersiva
- ⚡ **Performance Otimizada**: Carregamento rápido e experiência fluida em todos os dispositivos
- ♿ **Acessibilidade**: Compatível com leitores de tela e navegação por teclado

---

## 🚀 Funcionalidades

### 📄 Páginas

1. **Home** - Página inicial com vídeo background e apresentação do projeto
2. **Sobre** - Descrição detalhada da aplicação e suas funcionalidades
3. **Equipe** - Grid responsivo com 5 membros da equipe (imagens circulares, nomes e matrículas)
4. **Quiz** - Interface interativa para geração e realização de quizzes

### 🎯 Sistema de Quiz

- Input de tema personalizado
- Geração automática de 10 perguntas via IA
- 4 alternativas (A, B, C, D) por pergunta
- Navegação livre entre perguntas (avançar/voltar)
- Botão de saída (X) para interromper o quiz
- Sistema de pontuação ao final
- Feedback visual nas respostas

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização com Custom Properties (variáveis CSS)
- **JavaScript ES6+** - Lógica da aplicação
- **Google Gemini API** - Geração de quizzes com IA
- **CSS Grid & Flexbox** - Layout responsivo
- **CSS Animations** - Transições e animações suaves

---

## 📦 Estrutura do Projeto

```
eduvoice/
├── index.html                 # Página inicial
├── tasks.yml                  # Plano de ação e tarefas
├── README.md                  # Este arquivo
├── .gitignore                 # Arquivos ignorados pelo Git
│
├── assets/
│   ├── css/
│   │   ├── main.css          # Estilos principais
│   │   ├── responsive.css    # Media queries (375px, 768px, 1024px)
│   │   └── animations.css    # Animações e transições
│   │
│   ├── js/
│   │   ├── app.js            # JavaScript principal (navegação, menu)
│   │   ├── quiz.js           # Lógica do quiz
│   │   ├── gemini-api.js     # Integração com API Gemini
│   │   └── config.example.js # Exemplo de configuração da API
│   │
│   ├── images/
│   │   ├── member-1.jpg      # Imagem do membro 1 (Emanuel Ernesto)
│   │   ├── member-2.jpg      # Imagem do membro 2
│   │   ├── member-3.jpg      # Imagem do membro 3
│   │   ├── member-4.jpg      # Imagem do membro 4
│   │   ├── member-5.jpg      # Imagem do membro 5
│   │   ├── video-poster.jpg  # Poster do vídeo background
│   │   └── favicon.ico       # Ícone do site
│   │
│   └── videos/
│       └── apresentacao.mp4  # Vídeo de apresentação (background)
│
└── pages/
    ├── sobre.html            # Página sobre o projeto
    ├── equipe.html           # Página da equipe
    └── quiz.html             # Página do quiz interativo
```

---

## 🔧 Instalação e Configuração

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet (para API do Gemini)
- API Key do Google Gemini (gratuita)

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/seu-usuario/eduvoice.git
cd eduvoice
```

### Passo 2: Configure a API Key do Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Copie a chave gerada

5. Edite o arquivo `assets/js/gemini-api.js`:

```javascript
// Linha 16 - Substitua 'SUA_API_KEY_AQUI' pela sua chave
const API_KEY = "sua-chave-aqui";
```

**OU** (Recomendado para segurança):

1. Copie `assets/js/config.example.js` para `assets/js/config.js`
2. Edite `config.js` e adicione sua API key
3. Descomente a linha 19 em `gemini-api.js`

### Passo 3: Adicione os Assets

1. **Vídeo de apresentação**: Adicione um vídeo MP4 em `assets/videos/apresentacao.mp4`
2. **Imagens da equipe**: Adicione 5 fotos (300x300px) em `assets/images/member-1.jpg` até `member-5.jpg`
3. **Poster do vídeo**: Adicione uma imagem JPG em `assets/images/video-poster.jpg`
4. **Favicon**: Adicione um ícone em `assets/images/favicon.ico`

### Passo 4: Execute o Projeto

Abra o arquivo `index.html` no navegador ou use um servidor local:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code - Live Server
# Clique com botão direito em index.html > "Open with Live Server"
```

Acesse: `http://localhost:8000`

---

## 📖 Como Usar

1. **Navegue** pelas páginas usando o menu superior
2. Na página **Quiz**, digite um tema (ex: "História do Brasil", "Física Quântica")
3. Clique em **"Gerar Quiz"**
4. Aguarde enquanto a IA gera 10 perguntas personalizadas
5. **Responda** as perguntas selecionando uma das 4 alternativas
6. Use os botões **"← Anterior"** e **"Próxima →"** para navegar
7. Clique em **"Finalizar"** após responder todas as perguntas
8. Veja sua **pontuação** e inicie um novo quiz!

### Dica: Quiz sem API

Se não configurar a API key, o sistema automaticamente usará um quiz mock (demonstração) para testes.

---

## 🎨 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first** e é totalmente responsivo:

- **Mobile** (375px): Menu hamburger, layout em coluna única
- **Tablet** (768px): Menu expandido, grid de 2 colunas
- **Desktop** (1024px+): Layout completo, grid de 3 colunas

Testado em:

- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Edge 120+
- ✅ Safari 17+

---

## ⚙️ Configurações Avançadas

### Personalizar Número de Perguntas

Edite `assets/js/gemini-api.js`:

```javascript
// Linha 103 - Altere "10 perguntas" para o número desejado
Crie um quiz com exatamente 15 perguntas de múltipla escolha...
```

### Alterar Tema de Cores

Edite `assets/css/main.css`:

```css
:root {
  --primary-color: #4a90e2; /* Cor principal */
  --secondary-color: #50e3c2; /* Cor secundária */
  /* ... outras variáveis ... */
}
```

---

## 🐛 Solução de Problemas

### Erro: "API key inválida"

- Verifique se copiou a chave corretamente
- Certifique-se de que a API está ativada no Google Cloud

### Vídeo não carrega

- Verifique se o arquivo está em `assets/videos/apresentacao.mp4`
- Tente converter para formato MP4 (H.264)
- Reduza o tamanho do arquivo (máx 5MB recomendado)

### Quiz não gera

- Verifique a conexão com internet
- Abra o Console do navegador (F12) para ver erros

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---