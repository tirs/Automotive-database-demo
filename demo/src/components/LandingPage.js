import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });

  useEffect(() => {
    if (window.location.hash === '#demo') {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Formspree/Netlify Forms - set REACT_APP_FORM_ENDPOINT in env for production
      const endpoint = process.env.REACT_APP_FORM_ENDPOINT || '';
      if (endpoint) {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([k, v]) => v && formDataToSend.append(k, v));
        const res = await fetch(endpoint, { method: 'POST', body: formDataToSend });
        if (!res.ok) throw new Error('Submission failed');
      } else {
        // Demo mode - simulate success
        await new Promise(r => setTimeout(r, 1200));
      }
      setFormStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (err) {
      setFormStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            <a href="#demo">Request Demo</a>
            <Link to="/dashboard" className="nav-cta">Try Demo →</Link>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Fleet & Vehicle Management</div>
          <h1 className="hero-title">
            Never lose track of a vehicle again.
          </h1>
          <p className="hero-subtitle">
            The complete platform for dealerships, fleets, and service centers. 
            VIN decoding, predictive maintenance, recall tracking, and real-time insights—all in one place.
          </p>
          <div className="hero-ctas">
            <Link to="/dashboard" className="btn-hero-primary">Explore the Platform</Link>
            <a href="#demo" className="btn-hero-secondary">Schedule a Demo</a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">19</span>
              <span className="stat-label">Data Entities</span>
            </div>
            <div className="stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Powered Insights</span>
            </div>
            <div className="stat">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Real-time Sync</span>
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
                <div className="mockup-chart"></div>
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
        <p>Built for fleets and dealerships who demand reliability</p>
        <div className="trust-features">
          <span>Real NHTSA VIN API</span>
          <span>Recall Integration</span>
          <span>Predictive Maintenance</span>
          <span>Full Compliance Tracking</span>
        </div>
        <div className="trust-badges">
          <span className="trust-badge">NHTSA Certified Data</span>
          <span className="trust-badge">Enterprise-Grade Security</span>
          <span className="trust-badge">99.9% Uptime</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features">
        <h2>Everything you need. Nothing you don't.</h2>
        <p className="features-intro">One platform to manage vehicles, owners, service history, compliance, and AI-powered insights.</p>
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
            <div className="featured-badge">Most Popular</div>
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
            <a href="#demo" className="btn-pricing featured">Request Demo</a>
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
            <a href="#demo" className="btn-pricing">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* Request Demo Section */}
      <section id="demo" className="landing-demo">
        <div className="demo-content">
          <h2>See AutoDB in action</h2>
          <p>Get a personalized walkthrough. No commitment required.</p>
          <form onSubmit={handleSubmit} className="demo-form">
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Work email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="company"
              placeholder="Company name"
              value={formData.company}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Tell us about your fleet or dealership..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
            />
            <button type="submit" className="btn-submit" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'Sending...' : formStatus === 'success' ? 'Request Sent!' : 'Request Demo'}
            </button>
            {formStatus === 'success' && (
              <p className="form-success-msg">We'll be in touch within 24 hours.</p>
            )}
            {formStatus === 'error' && (
              <p className="form-error-msg">Something went wrong. Please try again or email us directly.</p>
            )}
          </form>
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
            <a href="#demo">Contact</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} AutoDB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
