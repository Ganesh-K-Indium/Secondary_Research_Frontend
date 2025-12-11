# Secondary Research Frontend

A modern React-based frontend for an intelligent research assistant that combines Retrieval-Augmented Generation (RAG) with multi-source data integration capabilities.

![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000.svg)

## 🌟 Features

### 🤖 Three Chat Modes

**Knowledge Assistant (RAG Mode)**
- Intelligent document search and retrieval
- Context-aware responses with source citations
- Advanced document source display with metadata
- Seamless knowledge discovery across your document library

**Source Convergence Point (Data Sources Mode)**
- Multi-agent coordination across enterprise platforms
- Unified access to Jira, Confluence, SharePoint, and Google Drive
- Intelligent data source orchestration
- Cross-platform information synthesis

**Quant Agent (Quantitative Analysis Mode)**
- Advanced quantitative modeling and analysis
- Stock market analysis and financial data processing
- Running quantitative models for data-driven insights
- Specialized tools for financial research and analytics

### 💬 Advanced Chat Interface

- **Session Management**: Persistent conversation threads with message history
- **Real-time Updates**: Live message counts and mode indicators in sidebar
- **Rich Formatting**: Enhanced text formatting with links, bold text, and structured lists
- **Responsive Design**: Optimized for desktop and mobile experiences

### 📄 Document Integration

- **PDF Viewer**: Built-in PDF viewing capabilities with `@react-pdf-viewer`
- **Source Attribution**: Clear document source display with metadata
- **Multi-format Support**: Handles various document types and sources

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend services running (see Environment Setup below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ganesh-K-Indium/Secondary_Research_Frontend.git
   cd Secondary_Research_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Setup

### Backend Services

This frontend requires three backend services to be running:

1. **RAG Backend** (Port 8020)
   - Handles knowledge retrieval and document search
   - Default URL: `http://localhost:8020/ask`

2. **Data Sources Backend** (Port 8006)
   - Manages multi-agent data source coordination
   - Default URL: `http://localhost:8006/chat`

3. **Quant Agent Backend** (Port 8007)
   - Provides quantitative analysis and financial modeling
   - Default URL: `http://localhost:8007/quant`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend URLs (optional - defaults provided)
REACT_APP_RAG_URL=http://localhost:8020/ask
REACT_APP_INGESTION_SERVER_URL=http://localhost:8006/chat
REACT_APP_QUANT_AGENT_URL=http://localhost:8007/quant

# Vercel deployment (for production)
vercel_token=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🏗️ Architecture

```
Frontend (React + Tailwind)
├── Knowledge Assistant (RAG Mode)
│   └── Connects to RAG Backend (Port 8020)
├── Source Convergence Point (Data Sources Mode)
│   └── Connects to Data Sources Backend (Port 8006)
└── Quant Agent (Quantitative Analysis Mode)
    └── Connects to Quant Agent Backend (Port 8007)
```

### Key Components

- **ChatInterface**: Main chat component with mode-specific formatting
- **SessionSidebar**: Session management with message counts and mode indicators
- **StatefulChats**: Chat state management for RAG, Data Sources, and Quant Agent modes
- **Session Management**: Persistent conversation threads with local storage

## 📱 Usage

### Switching Between Modes

1. **Knowledge Assistant**: For document search and retrieval with source citations
2. **Source Convergence Point**: For coordinating across multiple enterprise data sources
3. **Quant Agent**: For quantitative analysis, stock market research, and financial modeling

### Session Management

- Create new chat sessions for different research topics
- Switch between sessions while preserving conversation history
- View message counts and active modes in the sidebar (RAG, DS, QA)

### Document Sources

- RAG responses include clickable document sources with metadata
- Data Sources mode provides unified access to enterprise platforms
- All interactions are logged and persist across sessions

## 🧪 Testing

```bash
# Run the test suite
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Vercel (Production)

The application is automatically deployed to Vercel via GitHub Actions:

- **Production URL**: [https://secondary-research-frontend.vercel.app](https://secondary-research-frontend.vercel.app)
- **CI/CD**: Automated deployment on pushes to `main` branch
- **Build Command**: `npm run build`

### Manual Deployment

```bash
# Build for production
npm run build

# Serve the build locally
npm install -g serve
serve -s build
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App (irreversible)

### Tech Stack

- **Frontend**: React 19.1.1 with Hooks
- **Styling**: Tailwind CSS 3.4.17
- **PDF Viewing**: @react-pdf-viewer
- **Routing**: React Router DOM
- **Build Tool**: Create React App
- **Deployment**: Vercel with GitHub Actions CI/CD

### Project Structure

```
src/
├── components/
│   ├── ChatInterface.js          # Main chat component
│   ├── SessionSidebar.js         # Session management sidebar
│   ├── StatefulChats.js          # Chat state management (RAG, Data Sources, Quant Agent)
│   ├── Navbar.js                 # Navigation component
│   └── ...
├── hooks/
│   └── useSessionManager.js      # Session management hook
├── utils/
│   ├── utils.js                  # Utility functions
│   ├── logger.js                 # Logging utilities
│   └── migration.js              # Data migration logic
└── assets/                       # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Built with ❤️ for intelligent research and enterprise data integration**
