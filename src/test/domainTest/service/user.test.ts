
import { DUserService } from "../../../Domain/Service/DUserService";
import { IUserService } from "../../../Domain/Port/Out/Service/IUserService";
import { makeUserFaker, User } from "../../../Domain/Entity/User";


const user = makeUserFaker();

test("Test can create user valide", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(service.canCreateUser(user));
});

test("Test can create user invalide email déjà existant", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => true,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(user)).rejects.toThrow("Il existe déjà un compte qui utilise cette adresse email");
});

test("Test can create user invalide name déjà existant", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => true
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(user)).rejects.toThrow("Il existe déjà un compte qui utilise ce nom");
});

test("Test can create user invalide email et name déjà existants", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => true,
        isExistName: (name: string): boolean => true
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(user)).rejects.toThrow("Il existe déjà un compte qui utilise cette adresse email");
});

test("Validation de mot de passe valide 'P@ssword1234'", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(new User("Max", "max+test@gmail.com", "P@ssword1234")))
})

test("Validation de mot de passe invalide trop court 11 caractere 'password123'", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(new User("Max", "max+test@gmail.com", "password"))).rejects.toThrow("Mot de passe pas dois contenir au moin 12 caractère")
})

test("Validation de mot de passe invalide car pas de Maj 'password1234'", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(new User("Max", "max+test@gmail.com", "password1234"))).rejects.toThrow("Mot de passe pas dois contenir au moin une majuscule")
})

test("Validation de mot de passe invalide car pas de chiffre 'passworddddddddd'", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(new User("Max", "max+test@gmail.com", "Passworddddddddd"))).rejects.toThrow("Mot de passe pas dois contenir au moin un chiffre")
})

test("Validation de mot de passe invalide car pas de caracteres spéciaux 'Password1234'", async () => {
    const mockService: IUserService = {
        isExistEmail: (email: string): boolean => false,
        isExistName: (name: string): boolean => false
    };

    const service = new DUserService(mockService);

    await expect(() => service.canCreateUser(new User("Max", "max+test@gmail.com", "Password1234"))).rejects.toThrow("Mot de passe pas dois contenir au moin un caractère spécial")
})