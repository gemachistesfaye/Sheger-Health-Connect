import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Activity } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Patients',
    value: '1,234',
    subtext: 'active',
    icon: Activity,
    color: 'bg-emerald-500',
    trend: 12,
  };

  it('should render title and value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('should render subtext when provided', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should not render subtext when not provided', () => {
    render(<StatCard {...defaultProps} subtext={undefined} />);
    expect(screen.queryByText('active')).not.toBeInTheDocument();
  });

  it('should render positive trend indicator', () => {
    render(<StatCard {...defaultProps} trend={12} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('should render negative trend indicator', () => {
    render(<StatCard {...defaultProps} trend={-5} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('should not render trend when not provided', () => {
    render(<StatCard {...defaultProps} trend={undefined} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Total Patients: 1,234');
  });

  it('should render with default color when color not in map', () => {
    render(<StatCard {...defaultProps} color="bg-pink-500" />);
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
  });

  it('should render with different colors', () => {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    colors.forEach(color => {
      const { unmount } = render(<StatCard {...defaultProps} color={color} />);
      expect(screen.getByText('Total Patients')).toBeInTheDocument();
      unmount();
    });
  });
});
