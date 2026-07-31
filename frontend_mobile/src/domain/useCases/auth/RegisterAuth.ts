export class RegisterAuth {
  constructor(private authRepository: { register: () => Promise<unknown> }) {}

  async execute() {
    return this.authRepository.register();
  }
}
