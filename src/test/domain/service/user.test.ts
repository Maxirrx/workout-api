import { describe, test, expect, jest } from "@jest/globals";
import { DUserService } from "../../../Domain/Service/DUserService";
import { makeUserFaker, User } from "../../../Domain/Entity/User";
import { IUserRepository } from "../../../Infra/Repository/UserRepository";

function makeMockRepository(overrides: Partial<IUserRepository> = {}): IUserRepository {
  return {
    findByEmail: jest.fn<IUserRepository["findByEmail"]>().mockResolvedValue(undefined),
    findByName: jest.fn<IUserRepository["findByName"]>().mockResolvedValue(undefined),
    findById: jest.fn<IUserRepository["findById"]>().mockResolvedValue(undefined),
    findAll: jest.fn<IUserRepository["findAll"]>().mockResolvedValue([]),
    create: jest.fn<IUserRepository["create"]>().mockImplementation(async (user: User) => user),
    ...overrides
  };
}

describe("DUserService - canCreateUser", () => {
  const user = makeUserFaker();

  test("Peut créer un utilisateur valide", async () => {
    const repository = makeMockRepository();
    const service = new DUserService(repository);

    await expect(service.canCreateUser(user)).resolves.toBeUndefined();
  });

  test("Refuse un email déjà existant", async () => {
    const repository = makeMockRepository({ findByEmail: jest.fn<IUserRepository["findByEmail"]>().mockResolvedValue(user) });

    const service = new DUserService(repository);

    await expect(service.canCreateUser(user)).rejects.toThrow("Il existe déjà un compte qui utilise cette adresse email");
  });

  test("Refuse un nom déjà existant", async () => {
    const repository = makeMockRepository({ findByName: jest.fn<IUserRepository["findByName"]>().mockResolvedValue(user) });

    const service = new DUserService(repository);

    await expect(service.canCreateUser(user)).rejects.toThrow("Il existe déjà un compte qui utilise ce nom");
  });

  test("Refuse un email et un nom déjà existants", async () => {
    const repository = makeMockRepository({
      findByEmail: jest.fn<IUserRepository["findByEmail"]>().mockResolvedValue(user),

      findByName: jest.fn<IUserRepository["findByName"]>().mockResolvedValue(user)
    });

    const service = new DUserService(repository);

    await expect(service.canCreateUser(user)).rejects.toThrow("Il existe déjà un compte qui utilise cette adresse email");

    expect(repository.findByName).not.toHaveBeenCalled();
  });

  test("Accepte un mot de passe valide", async () => {
    const service = new DUserService(makeMockRepository());

    await expect(service.canCreateUser(new User("Max", "max+test@gmail.com", "P@ssword1234"))).resolves.toBeUndefined();
  });

  test("Refuse un mot de passe trop court", async () => {
    const service = new DUserService(makeMockRepository());

    await expect(service.canCreateUser(new User("Max", "max+test@gmail.com", "password"))).rejects.toThrow("Mot de passe pas dois contenir au moin 12 caractère");
  });

  test("Refuse un mot de passe sans majuscule", async () => {
    const service = new DUserService(makeMockRepository());

    await expect(service.canCreateUser(new User("Max", "max+test@gmail.com", "password1234"))).rejects.toThrow("Mot de passe pas dois contenir au moin une majuscule");
  });

  test("Refuse un mot de passe sans chiffre", async () => {
    const service = new DUserService(makeMockRepository());

    await expect(service.canCreateUser(new User("Max", "max+test@gmail.com", "Passworddddddddd"))).rejects.toThrow("Mot de passe pas dois contenir au moin un chiffre");
  });

  test("Refuse un mot de passe sans caractère spécial", async () => {
    const service = new DUserService(makeMockRepository());

    await expect(service.canCreateUser(new User("Max", "max+test@gmail.com", "Password1234"))).rejects.toThrow("Mot de passe pas dois contenir au moin un caractère spécial");
  });
});
