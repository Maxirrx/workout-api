import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { UserService } from "../../Service/UserService";
import { User } from "../../../Domain/Entity/User";

@injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "Données utilisateur invalides" });
        return;
      }

      const user = new User(name, email, password);

      const createdUser = await this.userService.create(user);

      res.status(201).json({ message: "Utilisateur créé avec succès", user: createdUser });
    } catch (error) {
      next(error);
    }
  };

  findByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const name = req.params.name;

      if (typeof name !== "string") {
        res.status(400).json({ error: "name invalide" });
        return;
      }

      const exists = await this.userService.findByName(name);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  };

  findByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.params.email;

      if (typeof email !== "string") {
        res.status(400).json({ error: "name invalide" });
        return;
      }

      const exists = await this.userService.findByEmail(email);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        res.status(400).json({ error: "id invalide" });
        return;
      }

      const exists = await this.userService.findByID(id);

      res.status(200).json({ exists });
    } catch (error) {
      next(error);
    }
  };
}
