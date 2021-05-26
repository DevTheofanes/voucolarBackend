import * as Yup from "yup";
import * as crypto from "crypto";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypt from "bcryptjs";

import User from "../models/User";
import MailerModule from "../modules/mailer";

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

  async index(request: Request, response: Response) {
    const usersRepository = getRepository(User);

    const id = request.usersId;
    const user = await usersRepository.findOne({where: { id }})
    
    if(!user?.manager){
      return response.json({error: "Only managers can access this route"})
    }

    const users = await usersRepository.find();

    return response.json(users);
  },

  async show(request: Request, response: Response) {
    const usersRepository = getRepository(User);

    if(!request.useManager){
      return response.json({error: "Only managers can access this route."})
    }

    const users = await usersRepository.find({ where: { manager: false }});

    return response.json(users);
  },


  async update(request: Request, response: Response) {
    const { id } = request.params;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return response.status(400).json({ error: "User not found" });
      // AQUI PODE FAZER UMA VERIFICAÇÃO CASO O USUARIO NÃO SEJA DESSE ID
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(4),
      password: Yup.string().min(4).required(),
      manager: Yup.boolean(),
      avatar: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const { email, oldPassword, password } = request.body;

    if(email && email !== user.email){
      const usersExists = await userRepository.findOne({
        where: { email },
      });
      
      if (usersExists) {
        return response
          .status(400)
          .json({ error: "Usuario com esse email já existe" });
      }
    }

    if (oldPassword) {
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        return response.status(400).json({
          error:
            "A senha fornecida não coincide com a senha cadastrada, por favor tente novamente!",
        });
      }
    }else{
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return response.status(400).json({
          error:
            "A senha fornecida não coincide com a senha cadastrada, por favor tente novamente!",
        });
      }
    }

    userRepository.merge(user, request.body);

    const userEdited = await userRepository.save(user);

    return response.status(200).json(userEdited);
  },

  async delete(request: Request, response: Response) {
    const usersRepository = getRepository(User);
    const { id } = request.params;

    const user = await usersRepository.findOne({ where: { id } });

    if (!user) {
      return response.status(400).json({ error: "Esse usuario não existe!" });
    }

    const idLogged = request.usersId;
    const userLogged = await usersRepository.findOne({where: { id: idLogged }});
    
    if(!userLogged?.manager && Number(id) !== Number(userLogged?.id)){
      return response.json({error: "Only managers can access this route"})
    }

    const results = await usersRepository.delete(id);
    return response.send(results);
  },

  //Recuperar senha

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    const newPassword = crypto.randomBytes(4).toString("hex");
    let password = await bcrypt.hash(newPassword, 8);

    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      return response
        .status(400)
        .json({ error: "Email não cadastrado na aplicação" });
    }

    try {
      await MailerModule.sendMail({
        from: "Administrador <0ae140a8d7-581724@inbox.mailtrap.io>",
        to: email,
        subject: "Recuperação de Senha!",
        html: `<p>Olá sua nova senha para acessa o aplicativo nautico é:${newPassword}</p></br><a>Sistema</a>`,
      });

      // user.password = password;
      // await usersRepository.save(user);

      return response.json({ message: "Email enviado com sucesso" });
    } catch (error) {
      return response.status(401).json({ message: "Faild to send" });
    }
  },
};
