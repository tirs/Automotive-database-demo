import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="landing-hero">
        <nav className="landing-nav">
          <div className="nav-brand">
            <span className="brand-icon">◈</span>
            <span>AutoDB</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link to="/dashboard" className="nav-cta">Try Demo →</Link>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-badge">Enterprise-Grade Fleet & Vehicle Intelligence</div>
          <h1 className="hero-title">
            The platform that scales with your fleet.
          </h1>
          <p className="hero-subtitle">
            Built for dealerships, fleets, and service centers. Real NHTSA integration, AI-driven maintenance, 
            recall compliance, and actionable insights—all in one enterprise-ready platform.
          </p>
          <div className="hero-ctas">
            <Link to="/dashboard" className="btn-hero-primary">Explore the Platform</Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">NHTSA</span>
              <span className="stat-label">Official API</span>
            </div>
            <div className="stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Predictive Engine</span>
            </div>
            <div className="stat">
              <span className="stat-value">Enterprise</span>
              <span className="stat-label">Ready to Scale</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-mockup">
            <div className="mockup-header">
              <span></span><span></span><span></span>
            </div>
            <div className="mockup-content">
              <div className="mockup-sidebar"></div>
              <div className="mockup-main">
                <div className="hero-showcase">
                  <img
                    src="https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Luxury car - Automotive fleet management"
                    className="hero-showcase-image"
                    loading="eager"
                  />
                  <div className="hero-showcase-overlay" />
                </div>
                <div className="mockup-cards">
                  <div></div><div></div><div></div><div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <section className="trust-bar">
        <p className="trust-tagline">Trusted by fleets and dealerships who demand reliability</p>
        <div className="trust-features">
          <span>Real NHTSA VIN API</span>
          <span>Recall Integration</span>
          <span>Predictive Maintenance</span>
          <span>Full Compliance Tracking</span>
        </div>
        <div className="trust-badges">
          <span className="trust-badge">NHTSA Certified Data</span>
          <span className="trust-badge">Enterprise-Grade Security</span>
          <span className="trust-badge">Scalable Architecture</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <h2>Built for the modern automotive industry</h2>
        <p className="features-intro">One platform to manage vehicles, owners, service history, compliance, and AI-powered insights—designed to scale.</p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Instant VIN Decoding</h3>
            <p>Real NHTSA API integration. Decode any vehicle in seconds—manufacturer, model, year, specs.</p>
          </div>
          <div className="feature-card">
            <h3>Predictive Maintenance</h3>
            <p>AI predicts when service is due. Reduce downtime and avoid costly breakdowns.</p>
          </div>
          <div className="feature-card">
            <h3>Recall & Safety Alerts</h3>
            <p>Automatic recall matching. Never miss a safety notice that affects your fleet.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Analytics</h3>
            <p>Cost trends, compliance status, fleet health—actionable insights at a glance.</p>
          </div>
          <div className="feature-card">
            <h3>Compliance Calendar</h3>
            <p>Inspections, insurance, warranties. Never let an expiration slip through.</p>
          </div>
          <div className="feature-card">
            <h3>Workflow Automation</h3>
            <p>Automated reminders, follow-ups, and notifications. Set it and forget it.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="landing-pricing">
        <h2>Simple, transparent pricing</h2>
        <p className="pricing-intro">Start free. Scale as you grow.</p>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">
              <span className="price-amount">$0</span>
              <span className="price-period">/month</span>
            </div>
            <p className="price-desc">Try the full platform free</p>
            <ul>
              <li>Up to 25 vehicles</li>
              <li>VIN Decoder</li>
              <li>Basic reports</li>
              <li>Email support</li>
            </ul>
            <Link to="/dashboard" className="btn-pricing">Get Started Free</Link>
          </div>
          <div className="pricing-card featured">
            <div className="featured-badge">Recommended</div>
            <h3>Professional</h3>
            <div className="price">
              <span className="price-amount">$199</span>
              <span className="price-period">/month</span>
            </div>
            <p className="price-desc">For growing fleets & dealerships</p>
            <ul>
              <li>Unlimited vehicles</li>
              <li>AI Predictive Maintenance</li>
              <li>Recall monitoring</li>
              <li>Advanced analytics</li>
              <li>Workflow automation</li>
              <li>Priority support</li>
            </ul>
            <Link to="/dashboard" className="btn-pricing featured">Get Started</Link>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">
              <span className="price-amount">Custom</span>
            </div>
            <p className="price-desc">For large operations</p>
            <ul>
              <li>Everything in Professional</li>
              <li>Custom integrations</li>
              <li>Dedicated support</li>
              <li>SLA guarantee</li>
            </ul>
            <Link to="/dashboard" className="btn-pricing">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">◈</span>
            <span>AutoDB</span>
          </div>
          <div className="footer-links">
            <Link to="/dashboard">Try Demo</Link>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} AutoDB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
