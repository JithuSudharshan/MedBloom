import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // In production, send to an error monitoring service (Sentry, etc.)
        if (import.meta.env.DEV) {
            console.error('React Error Boundary caught:', error, info);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '100vh',
                    fontFamily: 'Inter, sans-serif', background: '#f8fafc', padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#64748b', marginBottom: '2rem', textAlign: 'center' }}>
                        We've encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#00A4A3', color: 'white', border: 'none',
                            padding: '12px 28px', borderRadius: '8px', fontSize: '1rem',
                            cursor: 'pointer', fontWeight: '600'
                        }}
                    >
                        Refresh Page
                    </button>
                    {import.meta.env.DEV && (
                        <pre style={{
                            marginTop: '2rem', padding: '1rem', background: '#fef2f2',
                            borderRadius: '8px', fontSize: '0.75rem', color: '#991b1b',
                            maxWidth: '600px', overflow: 'auto'
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
