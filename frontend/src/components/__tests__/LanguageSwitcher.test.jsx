import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render current language', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should render globe icon button', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /Language: English/i })).toBeInTheDocument();
  });

  it('should open dropdown on click', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /Language: English/i }));
    expect(screen.getByRole('listbox', { name: 'Select language' })).toBeInTheDocument();
  });

  it('should show all language options', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /Language: English/i }));
    expect(screen.getByRole('option', { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Amharic/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Oromoo/ })).toBeInTheDocument();
  });

  it('should call i18n.changeLanguage when language is selected', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /Language: English/i }));
    fireEvent.click(screen.getByRole('option', { name: /Amharic/ }));
    expect(mockChangeLanguage).toHaveBeenCalledWith('am');
  });

  it('should mark current language as selected', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /Language: English/i }));
    const englishOption = screen.getByRole('option', { name: /English/ });
    expect(englishOption).toHaveAttribute('aria-selected', 'true');
  });
});
