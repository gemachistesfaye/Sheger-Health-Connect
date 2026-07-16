import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('should render copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 ShegerHealth/)).toBeInTheDocument();
  });

  it('should render developer name', () => {
    render(<Footer />);
    expect(screen.getByText(/Gemachis Tesfaye/)).toBeInTheDocument();
  });

  it('should render contact phone', () => {
    render(<Footer />);
    expect(screen.getByText('0976601074')).toBeInTheDocument();
  });

  it('should render privacy policy link', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('should render terms of service link', () => {
    render(<Footer />);
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('should render data policy link', () => {
    render(<Footer />);
    expect(screen.getByText('Data Policy')).toBeInTheDocument();
  });

  it('should have GitHub link with correct href', () => {
    render(<Footer />);
    const githubLink = document.querySelector('a[href="https://github.com/gemachistesfaye"]');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('should have email link with correct href', () => {
    render(<Footer />);
    const emailLink = document.querySelector('a[href="mailto:gemachistesfaye36@gmail.com"]');
    expect(emailLink).toBeInTheDocument();
  });

  it('should have Telegram link with correct href', () => {
    render(<Footer />);
    const telegramLink = document.querySelector('a[href="https://t.me/urjiiko1"]');
    expect(telegramLink).toBeInTheDocument();
    expect(telegramLink).toHaveAttribute('target', '_blank');
  });

  it('should render platform core section', () => {
    render(<Footer />);
    expect(screen.getByText('Platform Core')).toBeInTheDocument();
  });

  it('should render advanced health intelligence text', () => {
    render(<Footer />);
    expect(screen.getByText('Advanced Health Intelligence')).toBeInTheDocument();
  });
});
