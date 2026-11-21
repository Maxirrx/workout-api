import { makeUserFaker } from "../../../Domain/Entity/User";
import { DUserService } from "../../../Domain/Service/DUserService";
import { userRepository } from "../../../Infra/Repository/UserRepository";
import { UserService } from "../../../Infra/Service/UserService";

test("Test create - valide", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue(makeUserFaker())
  };

  const domainService = new DUserService(userRepositoryMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(userService.create(makeUserFaker()));
});
