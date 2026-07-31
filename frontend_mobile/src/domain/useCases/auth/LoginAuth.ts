export class LoginAuth {
  constructor(private authRepository: { login: () => Promise<unknown> }) {}

  async execute() {
    return this.authRepository.login();
  }
}
