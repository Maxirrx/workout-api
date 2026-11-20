export class User {
  name: string;
  email: string;
  password: string;
  email_verified_at?: Date | null;

  constructor(name : string, email : string, password: string){
    this.name = name
    this.email = email
    this.password = password
    
    this.validate()
  }

  validate(): void {
    this.checkEmail()
  }
  
  checkEmail(): void {
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    if(!emailReg.test(this.email)){
      throw new Error("Email invalide")
    }
  }

  checkPassword(): void {
    const minLenght = 12
    const checkMajReg = /[A-Z]/
    const checkNumbReg =  /\d/
    const checkSpecialCharacterReg = /^(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]+$/
    if(this.password.length < minLenght){
      throw new Error("Mot de passe pas dois contenir au moin 12 caractère")
    }
    else if(!checkMajReg.test(this.password)){
      throw new Error("Mot de passe pas dois contenir au moin une majuscule")
    }
    else if(!checkNumbReg.test(this.password)){
      throw new Error("Mot de passe pas dois contenir au moin un chiffre")
    }
    else if(!checkSpecialCharacterReg.test(this.password)){
      throw new Error("Mot de passe pas dois contenir au moin un caractère spécial")
    }
  }  
}

export function makeUserFaker(): User{
  return new User("Max", "max+test@gmail.com", "P@ssword1234")
}
