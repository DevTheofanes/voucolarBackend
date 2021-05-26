import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";

export default {
  async createAvatar(request: Request, response: Response) {
    const { filename } = request.file;
    const { id } = request.params;

    const userRepository = getRepository(User);

    const user: any = await userRepository.findOne({ where: { id } });

    user.avatar = filename;

    await userRepository.save(user);

    const userUpdated = await userRepository.findOne({ where: { id } });

    return response.json(userUpdated);
  },
};
