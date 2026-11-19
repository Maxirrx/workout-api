import { User } from "../../../Domain/Entity/User"

test("Validation d'email valide 'max+test@gmail.com'", () => {
    expect(new User("Max", "max+test@gmail.com", "P@ssword1234")).toBeInstanceOf(User)
})

test("Validation d'email invalide sans @ 'max+testgmail.com'", () => {
    expect(() => new User("Max", "max+testgmail.com", "P@ssword1234")).toThrow("Email invalide")
})

test("Validation d'email invalide sans . 'max+test@gmailcom'", () => {
    expect(() => new User("Max", "max+testgmailcom", "P@ssword1234")).toThrow("Email invalide")
})

test("Validation d'email invalide avec un espace 'max+t   est@gmail.com'", () => {
    expect(() => new User("Max", "max+testgmailcom", "P@ssword1234")).toThrow("Email invalide")
})

test("Validation de mot de passe valide 'P@ssword1234'", () => {
    expect(new User("Max", "max+test@gmail.com", "P@ssword1234")).toBeInstanceOf(User)
})

test("Validation de mot de passe invalide trop court 11 caractere 'password123'", () => {
    expect(() => new User("Max", "max+test@gmail.com", "password")).toThrow("Mot de passe pas dois contenir au moin 12 caractère")
})

test("Validation de mot de passe invalide car pas de Maj 'password1234'", () => {
    expect(() => new User("Max", "max+test@gmail.com", "password1234")).toThrow("Mot de passe pas dois contenir au moin une majuscule")
})

test("Validation de mot de passe invalide car pas de chiffre 'passworddddddddd'", () => {
    expect(() => new User("Max", "max+test@gmail.com", "Passworddddddddd")).toThrow("Mot de passe pas dois contenir au moin un chiffre")
})

test("Validation de mot de passe invalide car pas de caracteres spéciaux 'Password1234'", () => {
    expect(() => new User("Max", "max+test@gmail.com", "Password1234")).toThrow("Mot de passe pas dois contenir au moin un caractère spécial")
})