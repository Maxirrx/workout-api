import { makeUserFaker, User } from "../../../Domain/Entity/User";

test("Validation d'email valide 'max+test@gmail.com'", () => {
  expect(makeUserFaker()).toBeInstanceOf(User);
});

test("Validation d'email invalide sans @ 'max+testgmail.com'", () => {
  expect(() => makeUserFaker({email: "max+testgmail.com"})).toThrow("Email invalide");
});

test("Validation d'email invalide sans . 'max+test@gmailcom'", () => {
  expect(() => makeUserFaker({email: "max+testgmailcom"})).toThrow("Email invalide");
});

test("Validation d'email invalide avec un espace 'max+t   est@gmail.com'", () => {
  expect(() => makeUserFaker({email:  "max+t     estgmailcom",})).toThrow("Email invalide");
});
