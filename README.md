# 🧪 Slimestore - AI E-Commerce Chatbot

A production-ready, knowledge-driven AI chatbot for e-commerce customer support. Built with Next.js, powered by Groq LLM, and designed for seamless Vercel deployment.

![Slimestore Chatbot](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🎯 What is This?

Slimestore is an AI-powered customer support chatbot that can:
- Answer product questions
- Provide shipping & delivery information
- Explain return & refund policies
- Help with payment methods
- Track orders (mocked)
- Handle account-related queries
- Share promotions & discounts

**Key Feature:** Uses RAG (Retrieval-Augmented Generation) to answer ONLY from your knowledge base - no hallucinations!

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered** | Uses Groq's Llama 3.3 70B model for natural conversations |
| 📚 **Knowledge-Based** | Answers only from static markdown files (no database needed) |
| 🔍 **RAG System** | Retrieves relevant info before generating responses |
| 🛡️ **Safety Built-in** | Input sanitization, prompt injection protection, rate limiting |
| 💬 **Modern UI** | Beautiful chat interface with animations & dark mode |
| ⚡ **Fast** | Serverless architecture, edge-ready |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| 🚀 **Deploy Ready** | One-click Vercel deployment |

---

## 🛠️ Tech Stack

```
Frontend:       Next.js 16 + React 19 + TypeScript
Styling:        TailwindCSS 4
AI/LLM:         Groq API (Llama 3.3 70B)
Knowledge:      Static Markdown files
Deployment:     Vercel (serverless)
```

---

## 📁 Project Structure

```
chatbot/
├── knowledge/              # 📚 Knowledge base (source of truth)
│   ├── products.md         # Product catalog & pricing
│   ├── shipping.md         # Shipping options & policies
│   ├── returns.md          # Return & refund policies
│   ├── payments.md         # Payment methods & security
│   ├── orders.md           # Order management
│   ├── account.md          # Account help
│   ├── promotions.md       # Discounts & loyalty program
│   ├── tracking.md         # Order tracking info
│   ├── support.md          # Customer support contacts
│   ├── policies.md         # Store policies
│   ├── faq.md              # Frequently asked questions
│   └── greetings.md        # Conversation templates
│
├── src/
│   ├── app/
│   │   ├── api/chat/       # 🔌 API endpoint for chat
│   │   │   └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   └── ChatBot.tsx     # 💬 Main chat UI component
│   │
│   └── lib/
│       ├── knowledge.ts    # 📖 RAG: Knowledge loading & retrieval
│       └── safety.ts       # 🛡️ Input sanitization & rate limiting
│
├── .env.local              # 🔑 API keys (not committed)
├── .env.example            # Example environment file
└── vercel.json             # Vercel deployment config
```

---

## 🧠 How It Works

### The RAG (Retrieval-Augmented Generation) Flow:

```
User Question
     │
     ▼
┌─────────────────┐
│ Input Sanitizer │  ← Blocks prompt injection & harmful input
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Intent Detector │  ← Identifies topic (shipping? returns? products?)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Knowledge       │  ← Searches markdown files for relevant info
│ Retriever       │     using keyword matching & similarity
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Context Builder │  ← Combines retrieved knowledge chunks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ LLM (Groq)      │  ← Generates response using ONLY the context
└────────┬────────┘
         │
         ▼
    Bot Response
```

### Why RAG?
- ✅ No hallucinations - answers only from your knowledge
- ✅ Easy to update - just edit markdown files
- ✅ No database needed - everything is static
- ✅ Fast & cheap - minimal LLM tokens used

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Faizan-Vhora/slimestore-chatbot.git
cd slimestore-chatbot
npm install
```

### 2. Get Your Free API Key

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (free, no credit card)
3. Create an API key

### 3. Configure Environment

```bash
# Create .env.local file
echo "GROQ_API_KEY=your_api_key_here" > .env.local
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Faizan-Vhora/slimestore-chatbot)

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# GROQ_API_KEY = your_api_key
```

---

## 📝 Customizing the Knowledge Base

### To change what the chatbot knows:

1. Edit files in `/knowledge/` folder
2. Use markdown format with clear headings
3. Restart the dev server

### Example - Adding a new product:

```markdown
# In knowledge/products.md

### New Product
- **Super Slime XL** - $24.99 - Extra large slime, 
  perfect for sharing. Available in 5 colors.
```

### Best Practices:
- Use clear headings (`##`, `###`)
- Use bullet points for lists
- Keep information concise
- No duplicate content across files

---

## 🛡️ Safety Features

| Feature | Description |
|---------|-------------|
| **Input Sanitization** | Removes HTML, scripts, and dangerous characters |
| **Prompt Injection Protection** | Blocks attempts to override system instructions |
| **Rate Limiting** | 20 requests per minute per user |
| **Token Limits** | Max 500 tokens per response |
| **Fallback Responses** | Graceful handling of errors |

---

## 🎨 UI Customization

### Change Colors

Edit the gradient classes in `src/components/ChatBot.tsx`:

```tsx
// Header gradient
className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"

// User message bubble
className="bg-gradient-to-br from-violet-600 to-purple-700"
```

### Change Bot Name

Search and replace "Slimestore" in:
- `src/components/ChatBot.tsx`
- `src/app/layout.tsx`
- `knowledge/greetings.md`

---

## 📊 API Reference

### POST `/api/chat`

**Request:**
```json
{
  "message": "What slimes do you have?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}
```

**Response:**
```json
{
  "response": "We have a great selection of slimes! Our Classic Collection includes Butter Slime ($12.99), Cloud Slime ($14.99), Clear Slime ($10.99), and Floam Slime ($13.99). Would you like to know more about any of these?"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

**Faizan Vhora**
- GitHub: [@Faizan-Vhora](https://github.com/Faizan-Vhora)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) - For the blazing fast LLM API
- [Next.js](https://nextjs.org) - The React framework
- [Vercel](https://vercel.com) - For seamless deployment
- [TailwindCSS](https://tailwindcss.com) - For beautiful styling

---

<p align="center">
  Made with 💜 by Faizan AI
</p>
