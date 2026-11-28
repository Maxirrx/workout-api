import { ApiError } from "../../Utils/ApiError";

import { Image, makeImageFaker } from "./Image";
import { makeRoleFaker, Role } from "./Role";
import { WorkoutTemplate } from "./WorkoutTemplate";

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  is_public: boolean;
  is_enable: boolean;
  roles: Role[];
  phone?: string | null;
  picture?: Image | null;
  email_verified_at?: Date | null;

  favorites: WorkoutTemplate[];
  friends: User[];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    is_public: boolean,
    is_enable: boolean,
    roles: Role[] = [],
    phone?: string | null,
    picture?: Image | null,
    email_verified_at?: Date | null,
    favorites: WorkoutTemplate[] = [],
    friends: User[] = []
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.is_public = is_public;
    this.is_enable = is_enable;
    this.roles = roles;
    this.phone = phone;
    this.picture = picture;
    this.email_verified_at = email_verified_at;
    this.favorites = favorites;
    this.friends = friends;

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

export function makeUserFaker(user?: Partial<User>): User {
  const role = makeRoleFaker();
  const picture = makeImageFaker();
  const emailVerifiedAt = new Date("2024-01-01T12:00:00Z");

  return new User(
    user?.id ?? 1,
    user?.name ?? "Max",
    user?.email ?? "max+test@gmail.com",
    user?.password ?? "P@ssword1234",
    user?.is_public ?? false,
    user?.is_enable ?? true,
    user?.roles ?? [role],
    user?.phone ?? "+15550100001",
    user?.picture ?? picture,
    user?.email_verified_at ?? emailVerifiedAt,
    user?.favorites ?? [],
    user?.friends ?? []
  );
}
