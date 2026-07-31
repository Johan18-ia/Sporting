export interface UserLocalRepository {
  saveUser(): Promise<boolean>;
  getUser(): Promise<unknown>;
  removeUser(): Promise<boolean>;
}
