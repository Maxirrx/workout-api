
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { User, makeUserFaker } from "../../../Domain/Entity/User";
import { DUserService } from "../../../Domain/Service/DUserService";
import { IUserRepository } from "../../../Domain/Port/Out/Repository/IUserRepository";
import { UserService } from "../../../Infra/Service/UserService";


function makeMockRepository(): jest.Mocked<IUserRepository> {
  return {
    findByEmail: jest.fn<IUserRepository["findByEmail"]>(),
    findByName: jest.fn<IUserRepository["findByName"]>(),
    findById: jest.fn<IUserRepository["findById"]>(),
    findAll: jest.fn<IUserRepository["findAll"]>(),
    create: jest.fn<IUserRepository["create"]>(),
    update: jest.fn<IUserRepository["update"]>(),
    delete: jest.fn<IUserRepository["delete"]>(),
    disable: jest.fn<IUserRepository["disable"]>(),
    enable: jest.fn<IUserRepository["enable"]>()
  };
}

describe("UserService", () => {
  let repository: jest.Mocked<IUserRepository>;
  let service: UserService;
  let user: User;

  beforeEach(() => {
    repository = makeMockRepository();
    user = makeUserFaker();

    repository.findByEmail.mockResolvedValue(undefined);
    repository.findByName.mockResolvedValue(undefined);
    repository.findById.mockResolvedValue(undefined);
    repository.findAll.mockResolvedValue([]);
    repository.create.mockResolvedValue(user);
    repository.update.mockResolvedValue(user);
    repository.delete.mockResolvedValue(true);
    repository.disable.mockResolvedValue(true);
    repository.enable.mockResolvedValue(true);

    const domainService = new DUserService(repository);
    service = new UserService(repository, domainService);
  });

  test("create - valide", async () => {
    await expect(service.create(user)).resolves.toEqual(user);
    expect(repository.create).toHaveBeenCalledWith(user);
  });

  test("findByID - utilisateur trouvé", async () => {
    repository.findById.mockResolvedValue(user);

    await expect(service.findByID(1)).resolves.toEqual(user);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  test("findByID - utilisateur introuvable", async () => {
    await expect(service.findByID(999)).resolves.toBeUndefined();
  });

  test("findAll - retourne les utilisateurs", async () => {
    repository.findAll.mockResolvedValue([user]);

    await expect(service.findAll()).resolves.toEqual([user]);
  });

  test("findAll - aucun utilisateur", async () => {
    await expect(service.findAll()).resolves.toEqual([]);
  });

  test("update - valide", async () => {
    await expect(service.update(user)).resolves.toEqual(user);
    expect(repository.update).toHaveBeenCalledWith(user);
  });

  test("delete - valide", async () => {
    await expect(service.delete(1)).resolves.toBe(true);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  test("delete - utilisateur introuvable", async () => {
    repository.delete.mockResolvedValue(false);

    await expect(service.delete(999)).resolves.toBe(false);
  });

  test("disable - valide", async () => {
    await expect(service.disable(1)).resolves.toBe(true);
    expect(repository.disable).toHaveBeenCalledWith(1);
  });

  test("disable - utilisateur introuvable", async () => {
    repository.disable.mockResolvedValue(false);

    await expect(service.disable(999)).resolves.toBe(false);
  });

  test("enable - valide", async () => {
    await expect(service.enable(1)).resolves.toBe(true);
    expect(repository.enable).toHaveBeenCalledWith(1);
  });

  test("enable - utilisateur introuvable", async () => {
    repository.enable.mockResolvedValue(false);

    await expect(service.enable(999)).resolves.toBe(false);
  });

  test("update - erreur repository", async () => {
    repository.update.mockRejectedValue(new Error("Database error"));

    await expect(service.update(user)).rejects.toThrow("Database error");
  });

  test("delete - erreur repository", async () => {
    repository.delete.mockRejectedValue(new Error("Database error"));

    await expect(service.delete(1)).rejects.toThrow("Database error");
  });
});
