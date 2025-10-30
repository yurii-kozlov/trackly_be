import { User } from "#models/user/user.models.js";
import { ApiError } from "#utils/error-response.js";

class TokenService {
  async generateTokens(userId: string) {
    try {
      const user = await User.findById(userId);

      const accessToken = user?.generateAccessToken();
      const refreshToken = user?.generateRefreshToken();

      return {
        accessToken,
        refreshToken
      }
    } catch (error: unknown) {
      throw new ApiError(500, 'Something went wrong', [error]);
    }
  }
}

const tokenService = new TokenService();
const generateTokens = (userId: string) => tokenService.generateTokens(userId);

export {
  generateTokens
}