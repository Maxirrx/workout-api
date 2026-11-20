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
    expect(() => new User("Max", "max+t     estgmailcom", "P@ssword1234")).toThrow("Email invalide")
})
