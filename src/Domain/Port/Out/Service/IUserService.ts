export abstract class IUserService {
  abstract isExistEmail(email: string): boolean;
  abstract isExistName(name: string): boolean;
}
