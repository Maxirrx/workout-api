import { ApiError } from "../../Utils/ApiError";

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  is_public: boolean;
  is_enable: boolean;
  email_verified_at?: Date | null;

  constructor(id: number, name: string, email: string, password: string, is_public: boolean, is_enable: boolean) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.is_public = is_public;
    this.is_enable = is_enable;

    this.validate();
  }

  validate(): void {
    this.checkEmail();
  }

  checkEmail(): void {
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    if (!emailReg.test(this.email)) {
      throw new ApiError(400, "Email invalide", "INVALID_EMAIL");
    }
  }

  checkPassword(): void {
    const minLength = 12;
    const checkMajReg = /[A-Z]/;
    const checkNumbReg = /\d/;
    const checkSpecialCharacterReg = /^(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]+$/;
    if (this.password.length < minLength) {
      throw new ApiError(400, "Le mot de passe doit contenir au moins 12 caractères", "PASSWORD_TOO_SHORT");
    } else if (!checkMajReg.test(this.password)) {
      throw new ApiError(400, "Le mot de passe doit contenir au moins une majuscule", "PASSWORD_MISSING_UPPERCASE");
    } else if (!checkNumbReg.test(this.password)) {
      throw new ApiError(400, "Le mot de passe doit contenir au moins un chiffre", "PASSWORD_MISSING_NUMBER");
    } else if (!checkSpecialCharacterReg.test(this.password)) {
      throw new ApiError(400, "Le mot de passe doit contenir au moins un caractère spécial", "PASSWORD_MISSING_SPECIAL_CHARACTER");
    }
  }
}

export function makeUserFaker(): User {
  return new User(1, "Max", "max+test@gmail.com", "P@ssword1234", false, true);
}
