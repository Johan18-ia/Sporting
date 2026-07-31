export class GetUserLocal {
  constructor(private userLocalRepository: { getUser: () => Promise<unknown> }) {}

  async execute() {
    return this.userLocalRepository.getUser();
  }
}
