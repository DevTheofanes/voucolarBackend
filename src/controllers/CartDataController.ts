import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";
import CartData from "../models/CartData";

export default {
  async create(request: Request, response: Response) {
    const usersRepository = getRepository(User);
    const { name, manager, email, password, avatar } = request.body;

    const userExists = await usersRepository.findOne({ where: { email } });

    if (userExists) {
      return response.status(400).json({ error: "Usuario já existe!" });
    }

    const data = {
      avatar,
      manager,
      name,
      email,
      password,
    };

    const schema = Yup.object().shape({
      avatar: Yup.string(),
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required().min(4),
      manager: Yup.boolean().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    await schema.validate(data, {
      abortEarly: false,
    });

    const users = usersRepository.create(data);
    await usersRepository.save(users);

    return response.status(201).json(users);
  },
};
