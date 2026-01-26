# Student OS (Talapker OS)

> Super-App for students in Kazakhstan: university admission, test preparation (IELTS, SAT, UNT), and career planning.

## 🚀 Features

- **University Finder**: Search and filter 3000+ universities worldwide
- **Chances Calculator**: Get personalized Safety, Target, and Reach recommendations
- **AI Tutor**: IELTS essay checking and study plan generation with Google Gemini
- **Test Preparation**: Practice for IELTS, SAT, and UNT exams
- **Profile Management**: Track your stats and progress

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **Tailwind CSS** (Dark mode first design)
- **Lucide React** (Icons)
- **TypeScript**

### Backend
- **Supabase** (PostgreSQL, Authentication, Row Level Security)
- **Google Gemini 1.5 Flash** (AI Engine)

### Data Pipeline
- **Python 3.11+**
- **BeautifulSoup** (Web scraping)
- **libzim** (Khan Academy offline content)

## 📦 Project Structure

```
student-os/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   └── auth/              # Authentication pages
├── components/            # Reusable React components
├── lib/                   # Utilities and clients
│   └── supabase.ts       # Supabase client
├── scripts/              # Python data pipeline
│   ├── scraper_unitap.py # University data scraper
│   ├── zim_reader.py     # Khan Academy content reader
│   ├── ai_tutor.py       # Gemini AI integration
│   └── requirements.txt  # Python dependencies
├── supabase/
│   └── schema.sql        # Database schema
└── package.json
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Supabase account
- Google Gemini API key

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install Python dependencies
cd scripts
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Create a new Supabase project
2. Run the SQL schema:
   ```bash
   # In Supabase SQL Editor, paste and run:
   supabase/schema.sql
   ```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Data Pipeline

### Scrape University Data

```bash
cd scripts
python scraper_unitap.py
```

### Process Khan Academy Content

```bash
# Download ZIM file first from https://wiki.kiwix.org/
python zim_reader.py
```

### Test AI Tutor

```bash
python ai_tutor.py
```

## 📝 Database Schema

### Tables
- `profiles`: User profiles and stats
- `universities`: University database
- `programs`: Academic programs
- `saved_universities`: User's saved/applied universities
- `ai_chats`: AI interaction history

See [supabase/schema.sql](supabase/schema.sql) for full schema with RLS policies.

## 🎯 Roadmap

### Phase 1: Foundation (Current)
- [x] Database schema
- [x] Next.js project structure
- [x] Python data scripts skeleton
- [ ] Supabase authentication
- [ ] Basic UI components

### Phase 2: Core Features
- [ ] University finder with filters
- [ ] Chances calculator algorithm
- [ ] AI essay checker interface
- [ ] User dashboard

### Phase 3: Enhancement
- [ ] Real-time updates
- [ ] Progress tracking
- [ ] Study plan generator
- [ ] Mobile PWA

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

Built with ❤️ for students in Kazakhstan
