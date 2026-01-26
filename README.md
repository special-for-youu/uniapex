<div align="center">
  <img src="public/logo.png" alt="UNIAPEX Logo" width="120" />
  <h1>UNIAPEX</h1>
  <p>
    <strong>Empowering students to find their dream university and career path through AI-driven guidance.</strong>
  </p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-license">License</a>
  </p>
</div>

---

## 🚀 Features

### 🎓 University Finder
- **Global Database**: Access detailed information on 1,000+ universities worldwide.
- **Advanced Filtering**: Filter by location, tuition, ranking, and programs.
- **Admission Chances**: Calculate your acceptance probability (Safety, Target, Reach) based on GPA, IELTS, and SAT scores.

### 🤖 AI Tutor
- **Personalized Learning**: Get tailored study plans for IELTS, SAT, and UNT.
- **Essay Analysis**: AI-powered feedback on your admission essays.
- **24/7 Support**: Ask questions and get instant academic assistance.

### 💼 Career Guidance
- **Career Test**: Comprehensive personality and aptitude test to find your ideal career path.
- **CV Maker**: Build professional, academic-style resumes optimized for university applications.
- **Extracurriculars**: Discover opportunities to boost your profile.

### 📊 Student Dashboard
- **Track Progress**: Monitor your test scores, university applications, and to-do lists.
- **Favorites**: Save universities and programs for quick access.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AdilZhalgasbay/uniapex.git
    cd uniapex
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```
    *(Note: `.env.local` is gitignored to keep your secrets safe)*

4.  **Run the development server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by students, for students.</p>
</div>
