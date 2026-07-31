export class RemoveUserLocal {
  constructor(private userLocalRepository: { removeUser: () => Promise<boolean> }) {}

  async execute() {
    return this.userLocalRepository.removeUser();
  }
}
