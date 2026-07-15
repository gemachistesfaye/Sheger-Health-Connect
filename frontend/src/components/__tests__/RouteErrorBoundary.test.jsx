import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('RouteErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <RouteErrorBoundary>
        <div>Normal Content</div>
      </RouteErrorBoundary>
    );
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('should render error UI when child throws', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    render(
      <RouteErrorBoundary>
        <ThrowingComponent />
      </RouteErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('should render error description', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    render(
      <RouteErrorBoundary>
        <ThrowingComponent />
      </RouteErrorBoundary>
    );

    expect(screen.getByText(/unexpected error occurred/)).toBeInTheDocument();
  });

  it('should have try again button', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    render(
      <RouteErrorBoundary>
        <ThrowingComponent />
      </RouteErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try Again');
    expect(tryAgainButton.tagName).toBe('BUTTON');
  });

  it('should have go back button', () => {
    const ThrowingComponent = () => {
      throw new Error('Test error');
    };

    render(
      <RouteErrorBoundary>
        <ThrowingComponent />
      </RouteErrorBoundary>
    );

    const goBackButton = screen.getByText('Go Back');
    expect(goBackButton.tagName).toBe('BUTTON');
  });
});
