import { JwtPayload, sign, verify } from 'jsonwebtoken';

class JWT {
  generateToken = (data: object, time?:object): string => {
    const encrypted = sign(data, process.env.SECRET_KEY, time);
    return encrypted;
  };

  decodeToken = (access_token: string) => {
    try {
      const token = verify(access_token, process.env.SECRET_KEY) as JwtPayload;

      return token;
    } catch (err) {
      return null
    }
  }
}
export { JWT };
