import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const mockJwtService = {} as any;
    const mockUserService = {} as any;
    const mockReflector = {} as any;
    expect(new AuthGuard(mockJwtService, mockUserService, mockReflector)).toBeDefined();
  });
});
