import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('should render confirm and cancel buttons', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should use default props when not provided', () => {
    render(<ConfirmModal isOpen={true} onClose={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('should have correct type styling for danger', () => {
    render(<ConfirmModal {...defaultProps} type="danger" />);
    const confirmButton = screen.getByText('Delete');
    expect(confirmButton.className).toContain('bg-red-600');
  });

  it('should have correct type styling for info', () => {
    render(<ConfirmModal {...defaultProps} type="info" confirmText="OK" />);
    const confirmButton = screen.getByText('OK');
    expect(confirmButton.className).toContain('bg-emerald-600');
  });

  it('should have accessible dialog role', () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
