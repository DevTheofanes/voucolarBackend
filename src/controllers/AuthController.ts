import * as crypto from "crypto";
import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import MailerModule from "../modules/mailer";

export default {
  async session(request: Request, response: Response) {
    const repository = getRepository(User);
    const { email, password } = request.body;
    const user = await repository.findOne({ where: { email } });
    if (!user) {
      return response.status(400).json({ error: "Usuario não existe!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return response
        .status(400)
        .json({ error: "Senha ou Usuario errado, tente novamente" });
    }
    const token = jwt.sign(
      { id: user.id, manager: user.manager },
      "secret",
      {
        expiresIn: "7d",
      }
    );
    return response.json({ user, token });
  }
};
