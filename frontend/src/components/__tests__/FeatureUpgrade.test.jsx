import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureUpgrade from '@/components/FeatureUpgrade';

describe('FeatureUpgrade', () => {
  it('should render the provided title', () => {
    render(<FeatureUpgrade title="AI Chat" />);
    expect(screen.getByText(/AI Chat Experience/)).toBeInTheDocument();
  });

  it('should render coming soon badge', () => {
    render(<FeatureUpgrade title="Test" />);
    expect(screen.getByText('Coming to v2.0')).toBeInTheDocument();
  });

  it('should render feature preview cards', () => {
    render(<FeatureUpgrade title="Test" />);
    expect(screen.getByText('AI-Powered Automation')).toBeInTheDocument();
    expect(screen.getByText('Advanced Encryption')).toBeInTheDocument();
  });

  it('should render under development badge', () => {
    render(<FeatureUpgrade title="Test" />);
    expect(screen.getByText('Under Development')).toBeInTheDocument();
  });

  it('should render notify me button', () => {
    render(<FeatureUpgrade title="Test" />);
    expect(screen.getByText(/Notify Me When Ready/)).toBeInTheDocument();
  });

  it('should render intelligence and security labels', () => {
    render(<FeatureUpgrade title="Test" />);
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<FeatureUpgrade title="Test" />);
    expect(screen.getByText(/AI-driven interface/)).toBeInTheDocument();
  });
});
