export interface AuthRepository {
  login(): Promise<unknown>;
  register(): Promise<unknown>;
}
