import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindById } = vi.hoisted(() => ({ mockFindById: vi.fn() }));

vi.mock('../../models/User', () => ({
  default: { findByPk: mockFindById }
}));

import { UserService } from '../UserService';

describe('UserService', () => {
  beforeEach(() => {
    mockFindById.mockReset();
  });

  describe('getMe', () => {
    it('should return user if found', async () => {
      mockFindById.mockResolvedValueOnce({ id: 1, full_name: 'Test' });
      const user = await UserService.getMe(1);
      expect(user).toEqual({ id: 1, full_name: 'Test' });
      expect(mockFindById).toHaveBeenCalledWith(1, { attributes: { exclude: ['password_hash'] } });
    });

    it('should throw error if user not found', async () => {
      mockFindById.mockResolvedValueOnce(null);
      await expect(UserService.getMe(1)).rejects.toThrow('User not found');
    });
  });
});
