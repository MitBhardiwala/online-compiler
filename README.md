# 🚀 Online Compiler

A premium, modern, and highly interactive **Online Compiler & Execution Engine** featuring **AI-Powered Code Tools** and a sleek **Glassmorphism Dark Mode UI**. This application allows developers to write, compile, run, convert, and share code instantly in multiple languages—all within a secure, sandboxed containerized environment.

---

## ✨ Key Features

### 💻 1. Sandboxed Code Compilation & Execution
- Support for multiple languages: **Python**, **JavaScript**, **C**, **C++**, **PHP**, and **Go**.
- **Secure Sandbox**: Executes user code in isolated Docker containers, preventing unauthorized host system access.
- Interactive standard input (**stdin**) support for programs requiring manual input.
- Real-time compiler output, performance stats, and syntax error reports.

### 🤖 2. Gemini AI-Powered Assistant
Integration with Google Gemini API offers seamless AI tools built directly into the editor:
- **AI Code Generation**: Generate production-ready code templates and solutions from simple natural language prompts.
- **Interactive Code Editing**: Highlight a section of your code, supply an instruction, and watch the AI modify just that section.
- **Code Converter**: Instantly translate code between supported languages (e.g., C to Go, JavaScript to Python) while maintaining core logic and structure.
- **Smart Filename Recommendation**: Generates context-aware, clean filenames based on the code's functionality.

### 🔗 3. Code Sharing & Collaboration
- **Short-link Generation**: Create a shareable URL to easily share your code with other developers.
- **QR Code Generator**: Automatically generates a QR code for the shared link, allowing developers to scan and run code instantly on mobile or tablet devices.

### 🎨 4. Sleek & Responsive UI
- Developed with **React**, **Vite**, **Tailwind CSS**, and **CodeMirror**.
- Premium **dark mode** design featuring glassmorphism elements, custom micro-animations, and custom toast notifications.
- Integrated **Suggestions & Feedback Form** which automatically sends feedback emails to administrators.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Editor Engine**: CodeMirror (via `@uiw/react-codemirror`)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, PostCSS, React Icons
- **Routing**: React Router DOM (v7)
- **Utilities**: Axios, QRcode.react, React Hot Toast, React Helmet Async

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Sandboxing**: Docker API (running slim & alpine images)
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Email Service**: Nodemailer (via SMTP)
- **Logging & Monitoring**: Winston logger
- **Process Manager**: PM2 (via `ecosystem.config.cjs`)

---

## 📁 Repository Structure

```
online-compiler/
├── Backend/                    # Node.js Express backend service
│   ├── src/
│   │   ├── config/             # Environment & language profiles config
│   │   ├── controllers/        # Route controllers (AI, Compiler, Email)
│   │   ├── middleware/         # Express middlewares (Request Logging)
│   │   ├── routes/             # API Router definitions
│   │   ├── utils/              # Helper utilities (Docker execution, Mailer)
│   │   └── server.js           # Server entry point
│   ├── ecosystem.config.cjs    # PM2 Process management configuration
│   ├── package.json            # Node.js backend dependencies
│   └── .gitignore
│
├── Frontend/                   # Vite React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # SVGs, icons, and logos
│   │   ├── components/         # Reusable layouts, buttons, selector overlays
│   │   ├── config/             # Theme & route configuration
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Editor & LanguageEditor views
│   │   ├── services/           # API integrations (fetch & axios services)
│   │   ├── store/              # Redux store slice/actions definitions
│   │   └── main.jsx            # React root mount
│   ├── index.html              # Main single page application HTML template
│   ├── tailwind.config.js      # Tailwind configuration file
│   ├── vite.config.js          # Vite config settings
│   └── package.json            # Frontend configuration & dependencies
│
└── shared/                     # Shared configurations and assets (placeholder)
```

---

## 📡 API Endpoints Reference

The backend exposes the following REST API endpoints:

| Endpoint | Method | Description | Request Body Parameters |
| :--- | :--- | :--- | :--- |
| `/api/compiler/execute` | **POST** | Execute code securely in a Docker sandbox. | `{ language, code, input }` |
| `/api/ai/generate` | **POST** | Generate raw code from a description. | `{ prompt, language }` |
| `/api/ai/convert` | **POST** | Translate code between languages. | `{ code, sourceLanguage, targetLanguage }` |
| `/api/ai/edit` | **POST** | Apply interactive AI edit suggestions to code. | `{ fullCode, selectedCode, editSuggestion, language }` |
| `/api/ai/generate-filename`| **POST** | Suggest a filesystem-safe filename for code. | `{ code, language }` |
| `/api/share/generate-sharing-link` | **POST** | Generate a code sharing id. | `{ code, language }` |
| `/api/share/:shareId` | **GET** | Retrieve shared code block. | *None* |
| `/api/email/suggestions` | **POST** | Submit user suggestion via SMTP email. | `{ name, email, category, suggestion }` |

---

## 🛡️ Sandbox & Security Details
Code execution runs with strict constraints for safety:
1. **Container Isolation**: User code is executed inside a non-persistent, read-only Docker container.
2. **Cleanup Policy**: Host temporary files and container logs are deleted immediately after execution completes.
3. **Restricted Networks**: Docker containers run with limited permissions to prevent external attacks or local network scans.

---
