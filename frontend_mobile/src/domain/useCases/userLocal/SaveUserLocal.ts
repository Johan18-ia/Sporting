export class SaveUserLocal {
  constructor(private userLocalRepository: { saveUser: () => Promise<boolean> }) {}

  async execute() {
    return this.userLocalRepository.saveUser();
  }
}
