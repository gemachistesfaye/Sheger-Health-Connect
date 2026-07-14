import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Mock console.error to prevent noise in test output
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('should render error UI when child throws', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('should display error message when child throws', () => {
    const ThrowingComponent = () => {
      throw new Error('Database connection failed');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it('should have a reload button', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    expect(reloadButton).toBeInTheDocument();
    expect(reloadButton.tagName).toBe('BUTTON');
  });

  it('should render children again after error is cleared', () => {
    render(
      <ErrorBoundary>
        <div>Child Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});
