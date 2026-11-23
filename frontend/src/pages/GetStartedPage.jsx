import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Sparkles, Users } from 'lucide-react'

export default function GetStartedPage({ onLogin, onRegister }) {
  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-one" />
      <div className="landing-glow landing-glow-two" />

      <header className="landing-nav">
        <div className="landing-brand">
          <div className="landing-brand-mark"><BookOpen size={20} /></div>
          <div><strong>ThreadForge</strong><span>Content Studio</span></div>
        </div>
        <div className="landing-nav-actions">
          <button className="btn btn-ghost" onClick={onLogin}>Sign in</button>
          <button className="btn btn-primary" onClick={onRegister}>Get started</button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-kicker"><Sparkles size={14} /> Create, review, and publish with confidence</div>
          <h1>Turn ideas into content<br /><span>worth publishing.</span></h1>
          <p>ThreadForge gives writers and teams one professional workspace for drafting, editorial review, publishing, analytics, and administration.</p>
          <div className="landing-hero-actions">
            <button className="landing-primary" onClick={onRegister}>Create your workspace <ArrowRight size={17} /></button>
            <button className="landing-secondary" onClick={onLogin}>I already have an account</button>
          </div>
          <div className="landing-proof">
            <span><CheckCircle2 size={15} /> Focused writing</span>
            <span><CheckCircle2 size={15} /> Editorial review</span>
            <span><CheckCircle2 size={15} /> Role-based admin</span>
          </div>
        </section>

        <section className="landing-features">
          <article><BookOpen size={22} /><h3>A better writing flow</h3><p>Move naturally from drafts to review and publication in one organized studio.</p></article>
          <article><ShieldCheck size={22} /><h3>Professional control</h3><p>Manage users, roles, posts, reviews, and audit activity from a focused admin portal.</p></article>
          <article><Users size={22} /><h3>Built for collaboration</h3><p>Give every contributor a clear view of their own work while admins oversee the platform.</p></article>
        </section>
      </main>

      <footer className="landing-footer">ThreadForge Content Studio</footer>
    </div>
  )
}
