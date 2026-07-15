import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HealthSmartCards from '@/components/dashboard/HealthSmartCards';

describe('HealthSmartCards', () => {
  it('should render hydration card', () => {
    render(<HealthSmartCards />);
    expect(screen.getByText('Hydration')).toBeInTheDocument();
    expect(screen.getByText('1.2 / 2.5L')).toBeInTheDocument();
  });

  it('should render medication card', () => {
    render(<HealthSmartCards />);
    expect(screen.getByText('Medication')).toBeInTheDocument();
    expect(screen.getByText(/Amoxicillin at 2 PM/)).toBeInTheDocument();
  });

  it('should render digital patient ID card', () => {
    render(<HealthSmartCards />);
    expect(screen.getByText('Digital Patient ID')).toBeInTheDocument();
    expect(screen.getByText('Scan for emergency info')).toBeInTheDocument();
  });

  it('should render emergency contact card', () => {
    render(<HealthSmartCards />);
    expect(screen.getByText('Emergency')).toBeInTheDocument();
    expect(screen.getByText('Family: +251 900 000')).toBeInTheDocument();
  });

  it('should render mark as taken button', () => {
    render(<HealthSmartCards />);
    expect(screen.getByText('Mark as Taken')).toBeInTheDocument();
  });

  it('should render call clinic button', () => {
    render(<HealthSmartCards />);
    expect(screen.getByText('Call Clinic')).toBeInTheDocument();
  });
});
