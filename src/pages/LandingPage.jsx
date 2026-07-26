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
        <p className="notion-logos-title">Trusted by 98% of the Forbes Cloud 100</p>
        <div className="notion-logos-grid">
          <span>OpenAI</span>
          <span>Figma</span>
          <span>ramp ⊿</span>
          <span>CURSOR</span>
          <span>▲ Vercel</span>
          <span>NVIDIA</span>
          <span>V O L V O</span>
          <span>L'ORÉAL</span>
          <span>Discord</span>
        </div>
        <div className="notion-logos-grid row-2">
          <span>♥ Lovable</span>
          <span>1Password</span>
          <span>affirm</span>
          <span>RIOT GAMES</span>
          <span>clay</span>
          <span>remote</span>
          <span>F A I R E</span>
          <span>TOYOTA</span>
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
