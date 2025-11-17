import React from 'react'
import PhoneMock from './components/PhoneMock'

export default function App() {
  return (
    <div className="page">
      <nav className="topnav">
        <a className="nav-logo" href="#">Fibi</a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#download">Download</a>
        </div>
      </nav>
      <header className="hero">
        <div className="hero-left">
          <h1>Fibi — Research Administration Suite</h1>
          <p className="lead">Streamline proposals, awards, compliance, and service requests with real-time insights — anytime, anywhere.</p>

          <div className="actions">
            <a className="btn primary" href="#download">Get the app</a>
            <a className="btn ghost" href="#features">See features</a>
          </div>

          <ul className="badges" aria-hidden>
            <li>Secure</li>
            <li>Fast</li>
            <li>Lightweight</li>
          </ul>
        </div>

        <div className="hero-right">
          <PhoneMock />
        </div>
      </header>

      <main>
        <section id="benefits" className="benefits">
          <h2>Key Benefits of the Mobile Application</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-number">1</div>
              <h3>Anytime, Anywhere Access</h3>
              <p>Check essential research updates instantly without needing a laptop—perfect for researchers who are frequently on the move, attending conferences, or conducting fieldwork.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">2</div>
              <h3>Instant Awareness</h3>
              <p>Real-time alerts ensure you stay informed about important activities, system changes, and time-sensitive approvals the moment they occur.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">3</div>
              <h3>Faster Decision-Making</h3>
              <p>Quick views of proposals, service requests, and awards support faster actions and strategic planning, reducing decision bottlenecks.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">1</div>
              <h3>Improved Productivity</h3>
              <p>Lightweight mobile access reduces delays and keeps workflows moving even whilst commuting, travelling, or working remotely.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">2</div>
              <h3>User Convenience</h3>
              <p>Simplifies usage by presenting only the most important, relevant information in a clean, intuitive mobile interface designed for efficiency.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-number">3</div>
              <h3>Enhanced Engagement</h3>
              <p>Encourages more frequent interaction with FIBI, improving overall research management efficiency and stakeholder collaboration.</p>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <h2>Features</h2>
          <div className="grid">
            <Feature title="Notifications" desc="Real-time push notifications to keep you updated on important events." />
            <Feature title="Mail (sent) details" desc="View sent mail records with timestamps, recipients and status." />
            <Feature title="Proposal status" desc="Track proposal progress with clear status indicators and history." />
            <Feature title="Service request list" desc="A centralized list of service requests with filters and sorting." />
            <Feature title="Request status" desc="See live status for each request and receive updates until resolution." />
          </div>
        </section>

        <section id="download" className="download">
          <div className="download-content-wrapper" style={{ padding: '20px'}}>
            <div className="download-text-section">
              <p className="download-tagline">Ready to transform your research management?</p>
              <a
                className="download-btn-single"
                href="https://drive.google.com/uc?export=download&id=197VMtt_8Tl3PhzyAPp0ehn4FxaJB39qD"
                aria-label="Download FIBI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="download-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                <span>Download</span>
              </a>
            </div>
            <div className="download-image-section">
              <img src="/assets/fibiMain.png" alt="FIBI Application" className="download-app-image" />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Fibi — All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}
