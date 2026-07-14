import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock the useAuth hook
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn()
}));

import { useAuth } from '@/context/AuthContext';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render children when user has correct role', () => {
    useAuth.mockReturnValue({ user: { role: 'Patient' } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to admin dashboard when admin tries to access patient route', () => {
    useAuth.mockReturnValue({ user: { role: 'Admin' } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should redirect to doctor dashboard when doctor tries to access patient route', () => {
    useAuth.mockReturnValue({ user: { role: 'Doctor' } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/doctor/dashboard" element={<div>Doctor Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Doctor Dashboard')).toBeInTheDocument();
  });

  it('should allow access when user role is in allowedRoles', () => {
    useAuth.mockReturnValue({ user: { role: 'Doctor' } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should be case insensitive for role comparison', () => {
    useAuth.mockReturnValue({ user: { role: 'patient' } });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
