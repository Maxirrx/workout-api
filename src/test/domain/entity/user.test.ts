import { User } from "../../../Domain/Entity/User";

test("Validation d'email valide 'max+test@gmail.com'", () => {
  expect(new User(1, "Max", "max+test@gmail.com", "P@ssword1234", true, true)).toBeInstanceOf(User);
});

test("Validation d'email invalide sans @ 'max+testgmail.com'", () => {
  expect(() => new User(1, "Max", "max+testgmail.com", "P@ssword1234", true, true)).toThrow("Email invalide");
});

test("Validation d'email invalide sans . 'max+test@gmailcom'", () => {
  expect(() => new User(1, "Max", "max+testgmailcom", "P@ssword1234", true, true)).toThrow("Email invalide");
});

test("Validation d'email invalide avec un espace 'max+t   est@gmail.com'", () => {
  expect(() => new User(1, "Max", "max+t     estgmailcom", "P@ssword1234", true, true)).toThrow("Email invalide");
});
