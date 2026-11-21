import { makeUserFaker, User } from "../../../Domain/Entity/User";
import { IUserService } from "../../../Domain/Port/Out/Service/IUserService";
import { DUserService } from "../../../Domain/Service/DUserService";
import { userRepository } from "../../../Infra/Repository/UserRepository";
import { UserService } from "../../../Infra/Service/UserService";

test("Test isExistEmail - email inexistant", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn()
  };

  const userServiceMock: IUserService = { isExistEmail: (): boolean => false, isExistName: (): boolean => false };

  const domainService = new DUserService(userServiceMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(!userService.isExistEmail("max@gmail.com"));
});

test("Test isExistEmail - email existant", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(makeUserFaker()),
    findByName: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn()
  };

  const userServiceMock: IUserService = { isExistEmail: (): boolean => false, isExistName: (): boolean => false };

  const domainService = new DUserService(userServiceMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(userService.isExistEmail("max@gmail.com"));
});
test("Test isExistName - Name inexistant", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn()
  };

  const userServiceMock: IUserService = { isExistEmail: (): boolean => false, isExistName: (): boolean => false };

  const domainService = new DUserService(userServiceMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(!userService.isExistName("max"));
});

test("Test isExistName - Name existant", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(makeUserFaker()),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn()
  };

  const userServiceMock: IUserService = { isExistEmail: (): boolean => false, isExistName: (): boolean => false };

  const domainService = new DUserService(userServiceMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(userService.isExistName("max"));
});

test("Test create - valide", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(makeUserFaker()),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn()
  };

  const userServiceMock: IUserService = { isExistEmail: (): boolean => false, isExistName: (): boolean => false };

  const domainService = new DUserService(userServiceMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(userService.create(makeUserFaker()));
});

test("Test create - invalide", async () => {
  const userRepositoryMock: userRepository = {
    findByEmail: jest.fn().mockResolvedValue(undefined),
    findByName: jest.fn().mockResolvedValue(makeUserFaker()),
    findById: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn()
  };

  const userServiceMock: IUserService = { isExistEmail: (): boolean => true, isExistName: (): boolean => false };

  const domainService = new DUserService(userServiceMock);

  const userService = new UserService(userRepositoryMock, domainService);

  await expect(userService.create(makeUserFaker())).rejects.toThrow("Il existe déjà un compte qui utilise cette adresse email");
});
