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
          <h1>Fibi — Your smart finance companion</h1>
          <p className="lead">Track spending, set budgets, and reach goals with delightful insights.</p>

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
          <h2>Download Fibi</h2>
          <p>Available on iOS and Android — tiny download, fast setup.</p>
          <div className="stores">
            <a className="store" href="#" aria-label="Download on the App Store">
              <img src="/assets/badge-appstore.svg" alt="App Store" />
            </a>
            <a className="store" href="#" aria-label="Get it on Google Play">
              <img src="/assets/badge-playstore.svg" alt="Google Play" />
            </a>
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
