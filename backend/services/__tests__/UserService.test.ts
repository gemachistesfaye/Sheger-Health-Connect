import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindByPk } = vi.hoisted(() => ({ mockFindByPk: vi.fn() }));

vi.mock('../../models/User', () => ({
  default: { findByPk: mockFindByPk }
}));

import { UserService } from '../UserService';

describe('UserService', () => {
  beforeEach(() => {
    mockFindByPk.mockReset();
  });

  describe('getMe', () => {
    it('should return user if found', async () => {
      mockFindByPk.mockResolvedValueOnce({ id: 1, full_name: 'Test' });
      const user = await UserService.getMe(1);
      expect(user).toEqual({ id: 1, full_name: 'Test' });
      expect(mockFindByPk).toHaveBeenCalledWith(1, { attributes: { exclude: ['password_hash'] } });
    });

    it('should throw error if user not found', async () => {
      mockFindByPk.mockResolvedValueOnce(null);
      await expect(UserService.getMe(1)).rejects.toThrow('User not found');
    });
  });
});
