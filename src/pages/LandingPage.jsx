import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const HIGHLIGHT_WORDS = [
  { text: 'Think', bg: '#EBF3FF', dot: '#0066FF' },
  { text: 'Create', bg: '#FFEFE3', dot: '#FF6B00' },
  { text: 'Build', bg: '#FFF6D8', dot: '#F5B000' },
  { text: 'Scale', bg: '#D9F2ED', dot: '#249487' },
  { text: 'Jam', bg: '#F0E5FF', dot: '#8936FF' }
];

export default function LandingPage() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HIGHLIGHT_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentWord = HIGHLIGHT_WORDS[wordIndex];

  return (
    <div className="notion-landing">
      {/* Navigation */}
      <nav className="notion-nav">
        <div className="notion-nav-left">
          <div className="notion-logo">
            <img src="/notion.png" alt="Notion" style={{ width: '28px', height: '28px' }} />
          </div>
          <div className="notion-nav-links">
            <a href="#">Product <span>▾</span></a>
            <a href="#">Solutions <span>▾</span></a>
            <a href="#">Resources <span>▾</span></a>
            <a href="#">Developers</a>
            <a href="#">Enterprise</a>
            <a href="#">Pricing</a>
            <a href="#">Request a demo</a>
          </div>
        </div>
        <div className="notion-nav-right">
          <Link to="/login" className="notion-link">Log in</Link>
          <Link to="/login" className="notion-btn notion-btn-primary">Get Notion free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="notion-hero">
        <div className="notion-hero-icons">
          {/* Mock icons for the grouped faces */}
          <div className="icon-circle" style={{background: '#fff', border: '2px solid #000'}}>👩🏻</div>
          <div className="icon-circle" style={{background: '#fff', border: '2px solid #000'}}>🤔</div>
          <div className="icon-circle" style={{background: '#f8d9d9', border: '2px solid #000'}}>🪧</div>
          <div className="icon-circle" style={{background: '#ffeaad', border: '2px solid #000'}}>🧑🏽‍🦱</div>
          <div className="icon-circle" style={{background: '#fff', border: '2px solid #000'}}>🧐</div>
          <div className="icon-circle" style={{background: '#d1e6ff', border: '2px solid #000'}}>📁</div>
          <div className="icon-circle" style={{background: '#fff', border: '2px solid #000', color: '#ff5555'}}>👨🏻‍🦳</div>
        </div>
        
        <h1 className="notion-hero-title">
          Where teams and<br/>
          <span style={{ whiteSpace: 'nowrap' }}>agents <span className="notion-highlight" style={{ backgroundColor: currentWord.bg }}><span className="notion-dot" style={{ backgroundColor: currentWord.dot }}></span><span className="highlight-text" key={wordIndex}>{currentWord.text}</span></span> together.</span>
        </h1>
        <p className="notion-hero-subtitle">
          Capture context, find answers, and automate tasks with AI built for your team.
        </p>
        
        <div className="notion-hero-ctas">
          <Link to="/login" className="notion-btn notion-btn-primary notion-btn-large">Get Notion free</Link>
          <a href="#" className="notion-btn notion-btn-secondary notion-btn-large">Request a demo</a>
        </div>
        
        <div className="notion-hero-visual">
          <div className="notion-mock-window">
            <div className="notion-mock-header">
              <span className="notion-mock-dot"></span>
              <span className="notion-mock-dot"></span>
              <span className="notion-mock-dot"></span>
              <div className="notion-mock-tab active">Ramp</div>
              <div className="notion-mock-tab">Ramp HQ</div>
            </div>
            <div className="notion-mock-body">
              <div className="notion-mock-sidebar">
                <div className="mock-item">Home</div>
                <div className="mock-item">Upcoming events</div>
                <div className="mock-item"><span style={{color: '#0066FF'}}>■</span> Design Weekly</div>
              </div>
              <div className="notion-mock-content">
                <div className="mock-line">Review performance metrics</div>
                <div className="mock-line">Respond to beta test questions</div>
                <div className="mock-line">Plan upcoming sprint goals</div>
              </div>
            </div>
          </div>
          <div className="floating-icon icon-left">📖 ✓</div>
          <div className="floating-icon icon-right">🐈 ☑</div>
        </div>
      </header>

      {/* Logos Section */}
      <section className="notion-logos-section">
        <p className="notion-logos-title" style={{ display: 'none' }}>Trusted by 98% of the Forbes Cloud 100</p>
        
        <div className="notion-logos-grid" style={{ gap: '32px', marginBottom: '24px' }}>
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '20px' }}>OpenAI</span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 500, fontSize: '22px' }}>Figma</span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 600, fontSize: '20px' }}>ramp <span style={{ fontSize: '18px', fontWeight: 900 }}>⊿</span></span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '16px', letterSpacing: '1px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            CURSOR
          </span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
            Vercel
          </span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: '20px', letterSpacing: '0.5px', fontStyle: 'italic' }}>
            <span style={{ background: '#000', color: '#fff', padding: '0 4px', borderRadius: '2px', marginRight: '4px', fontStyle: 'normal' }}>NV</span>
            NVIDIA
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '14px', letterSpacing: '6px', marginLeft: '16px' }}>
            V O L V O
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 400, fontSize: '20px', letterSpacing: '2px', marginLeft: '16px' }}>
            L'ORÉAL
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '18px', marginLeft: '16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.33-.35-.76-.53-1.09a.09.09 0 0 0-.07-.03c-1.5.26-2.94.71-4.27 1.33a.08.08 0 0 0-.05.05C2.79 11.5 2.05 17.31 2.85 23a.08.08 0 0 0 .04.06c1.78 1.32 3.51 2.11 5.2 2.65a.09.09 0 0 0 .1-.03c.4-.55.77-1.13 1.1-1.74a.09.09 0 0 0-.04-.12c-.56-.21-1.1-.47-1.61-.75a.09.09 0 0 1-.01-.15c.11-.08.22-.17.33-.25a.08.08 0 0 1 .08-.01c3.42 1.56 7.12 1.56 10.5 0a.08.08 0 0 1 .09.01c.11.08.22.17.33.26a.09.09 0 0 1-.01.15c-.52.28-1.06.54-1.62.75a.09.09 0 0 0-.04.12c.33.61.7 1.19 1.1 1.74a.09.09 0 0 0 .1.03c1.7-.54 3.43-1.33 5.21-2.65a.08.08 0 0 0 .04-.06c.86-6.19-.18-11.83-1.92-17.62a.08.08 0 0 0-.05-.05zM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.41s.95-2.41 2.15-2.41c1.21 0 2.17 1.09 2.15 2.41 0 1.33-.95 2.41-2.15 2.41zm7.97 0c-1.18 0-2.15-1.08-2.15-2.41s.95-2.41 2.15-2.41c1.21 0 2.17 1.09 2.15 2.41 0 1.33-.95 2.41-2.15 2.41z"/></svg>
            Discord
          </span>
        </div>
        
        <div className="notion-logos-grid row-2" style={{ gap: '32px' }}>
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Lovable
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: '#000', color: '#fff', borderRadius: '50%', fontSize: '12px' }}>1</span>
            1Password
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '22px', letterSpacing: '-1px' }}>
            affirm
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.5px', lineHeight: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px' }}>
                <div style={{ width: '4px', height: '12px', background: '#000' }}></div>
                <div style={{ width: '4px', height: '18px', background: '#000' }}></div>
                <div style={{ width: '4px', height: '24px', background: '#000' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span>RIOT</span>
                <span>GAMES</span>
              </div>
            </div>
          </span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '22px', letterSpacing: '-1px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px' }}><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-2-15a5 5 0 0 0-5 5h2a3 3 0 0 1 3-3V7zm4 0v2a3 3 0 0 1 3 3h2a5 5 0 0 0-5-5z"/></svg>
            clay
          </span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
            <span style={{ fontWeight: 900, fontSize: '24px', marginRight: '4px' }}>r</span>
            remote
          </span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'serif', fontWeight: 400, fontSize: '16px', letterSpacing: '6px' }}>
            F A I R E
          </span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
          
          <span className="logo-item" style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: '20px', letterSpacing: '1px' }}>
            TOYOTA
          </span>
          <span className="dot-separator" style={{ color: '#aaa', fontSize: '24px' }}>·</span>
        </div>
      </section>

      {/* AI where your team works */}
      <section className="notion-section notion-features">
        <h2 className="notion-section-title">AI where your team works.</h2>
        <div className="notion-cards-container">
          <div className="notion-card feature-card blue-bottom">
            <div className="notion-card-header">
              <p className="notion-card-tag">Capture knowledge</p>
              <h3>Bring everything into one system of record. <span className="arrow-btn">→</span></h3>
            </div>
            <div className="notion-card-visual blue-bg">
              <div className="mock-ui-box">
                <h4 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{color: '#0066ff'}}>🎙</span> Meetings</h4>
                <div style={{display: 'flex', gap: '12px', fontSize: '12px', color: '#666', marginTop: '12px'}}>
                  <span>★ EPD meetings</span>
                  <span>📍 My meetings</span>
                  <span>+</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="notion-card feature-card red-bottom">
            <div className="notion-card-header">
              <p className="notion-card-tag">Find answers</p>
              <h3>Get answers, instantly—with citations. <span className="arrow-btn">→</span></h3>
            </div>
            <div className="notion-card-visual red-bg">
              <div className="mock-ui-box">
                <h4 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{color: '#e03e3e'}}>🏆</span> H2 Deal Flow Dashboard</h4>
                <div style={{display: 'inline-flex', padding: '4px 8px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', color: '#666', marginTop: '12px'}}>
                  ↻ Syncing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automate busywork */}
      <section className="notion-section notion-automate">
        <div className="notion-automate-banner">
          <div className="automate-text">
            <p className="notion-card-tag">Automate busywork</p>
            <h2>Keep work moving 24/7 with agents.</h2>
            <span className="arrow-btn large">→</span>
          </div>
          <div className="automate-visual">
            <div className="automate-bg-yellow"></div>
            <div className="automate-mock-ui">
              <div className="mock-kanban">
                <h4>🗃 Engineering Tasks</h4>
                <div className="kanban-cols">
                  <div className="kanban-col">
                    <div className="kanban-col-header"><span className="dot orange"></span> New 2</div>
                    <div className="kanban-card">
                      <p>Fix wrap on H1</p>
                      <div className="kanban-agent"><span className="agent-icon">🤖</span> Coding Agent</div>
                      <span className="kanban-tag red">High priority</span>
                    </div>
                  </div>
                  <div className="kanban-col">
                    <div className="kanban-col-header"><span className="dot blue"></span> In progress 3</div>
                    <div className="kanban-card">
                      <p>Create source map</p>
                      <span className="kanban-tag yellow">Medium priority</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="automate-agent-panel">
                <div className="agent-header">
                  <div className="agent-avatar">🤖</div>
                  <h3>Coding Agent</h3>
                </div>
                <div className="agent-chat">
                  <div className="agent-msg user">Take a look at what's in 🗃 Engineering Tasks to see if there's anything you can take off our team's plate</div>
                  <div className="agent-msg system">
                    Let me take a quick look at what's in flight and what's new.
                    <br/><br/>
                    ✓ Updated 5 pages in 🗃 Engineering Tasks
                    <br/><br/>
                    I went ahead and assigned myself a few tasks. It looks like <strong>Fix wrap on H1</strong> is the highest priority there. Want me to go ahead and get started?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="section-label">See what Notion can do</p>
        <div className="notion-use-cases">
          <div className="use-case-card">
            <div className="use-case-icon">📬</div>
            <h4>Triage product feedback →</h4>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">🎫</div>
            <h4>Resolve support tickets in Slack →</h4>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">🚨</div>
            <h4>Respond to security alerts faster →</h4>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">🍏</div>
            <h4>Automate weekly reporting →</h4>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">💡🤖</div>
            <h4>Create your own developer tools →</h4>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="notion-section notion-testimonials">
        <h2 className="notion-section-title large">Trusted by teams that ship.</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card red-overlay">
            <div className="testimonial-logo">CURSOR</div>
            <div className="testimonial-content">
              <p>“Using the most AI-native tools like Notion is an important competitive advantage for us to stay small while doing a lot.”</p>
              <p className="author">Michael Truell, Co-founder & CEO</p>
            </div>
          </div>
          <div className="testimonial-card blue-overlay">
            <div className="testimonial-logo">F A I R E</div>
            <div className="testimonial-content">
              <p>“Notion’s thoughtful design speeds up collaboration and decisions so we can deliver impact to our customers faster.”</p>
              <p className="author">Renee Solorzano, Sr. Director of Product Design</p>
            </div>
          </div>
          <div className="testimonial-card yellow-overlay">
            <div className="testimonial-logo">ramp ⊿</div>
            <div className="testimonial-content">
              <p>“Notion Custom Agents help our team go beyond doing work with AI to building AI tools that do the work for them.”</p>
              <p className="author">Ben Levick, Head of Operations & Internal AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="notion-footer-cta">
        <h2>Get started today.</h2>
        <div className="notion-hero-ctas" style={{justifyContent: 'center'}}>
          <Link to="/login" className="notion-btn notion-btn-primary">Get Notion free</Link>
          <a href="#" className="notion-btn notion-btn-secondary">Request a demo</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="notion-footer">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src="/notion.png" alt="Notion" style={{ width: '28px', height: '28px' }} />
            <span>Notion</span>
          </div>
          <div className="social-links">
            <span>📷</span> <span>𝕏</span> <span>💼</span> <span>f</span> <span>▶</span>
          </div>
          <div className="lang-selector">
            🌐 English (US) ▾
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About us</a>
          <a href="#">Careers</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
          <a href="#">Terms & privacy</a>
          <a href="#">Your privacy rights</a>
        </div>
        <div className="footer-col">
          <h4>Download</h4>
          <a href="#">iOS & Android</a>
          <a href="#">Mac & Windows</a>
          <a href="#">Calendar</a>
          <a href="#">Web Clipper</a>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#">Help center</a>
          <a href="#">Pricing</a>
          <a href="#">Blog</a>
          <a href="#">Community</a>
          <a href="#">Connections</a>
          <a href="#">Templates</a>
          <a href="#">Partner programs</a>
        </div>
        <div className="footer-col">
          <h4>Notion for</h4>
          <a href="#">Enterprise</a>
          <a href="#">Startups</a>
          <a href="#">Small business</a>
          <a href="#">Personal</a>
        </div>
      </footer>
    </div>
  );
}
