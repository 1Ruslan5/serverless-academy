import * as crypto from 'crypto';

export const generateRefreshToken = () => {
    const refresh_token = crypto.randomBytes(16).toString('hex');

    return refresh_token;
}