import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          color: 'rgba(255, 255, 255, 0.9)', 
          background: '#0a0e27', 
          minHeight: '100vh',
          fontFamily: 'system-ui'
        }}>
          <div style={{
            background: 'rgba(20, 27, 45, 0.6)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h1 style={{ marginTop: 0 }}>Application Error</h1>
            <p>Something went wrong. Please check the details below.</p>
            
            {this.state.error && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '8px' 
              }}>
                <h3>Error Details:</h3>
                <pre style={{ 
                  background: '#141b2d', 
                  padding: '15px', 
                  borderRadius: '5px', 
                  overflow: 'auto',
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    '\n\nComponent Stack:\n' + this.state.errorInfo.componentStack
                  )}
                </pre>
              </div>
            )}

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
              <h3>Troubleshooting:</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Check browser console (F12) for more details</li>
                <li>Verify environment variables are set in Netlify</li>
                <li>Clear browser cache and try again</li>
                <li>Check Netlify build logs for errors</li>
              </ul>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

