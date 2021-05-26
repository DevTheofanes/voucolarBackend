import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

import Mark from "../models/Mark";
import Model from "../models/Model";

export default {
  async create(request: Request, response: Response) {
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const markRepository = getRepository(Mark);
    const { name } = request.body;
    const { filename } = request.file;


    const markExists = await markRepository.findOne({ where: { name } });

    if (markExists) {
      return response.status(400).json({ error: "Essa marca já existe" });
    }

    const data = {
      name,
      image:filename
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const mark = markRepository.create(data);
    await markRepository.save(mark);

    return response.status(201).json(mark);
  },

  async index(request:Request, response: Response){
    const markRepository = getRepository(Mark);

    const marks = await markRepository.find();

    return response.json(marks)
  },

  async update(request:Request, response:Response){
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const markRepository = getRepository(Mark);
    const { id } = request.params;
    const { filename } = request.file;

    const markExists = await markRepository.findOne({ where: { id } });

    if (!markExists) {
      return response.status(400).json({ error: "Essa marca não existe" });
    }
    
    const data = {
      image: filename
    };

    markRepository.merge(markExists, data);

    const markEdited = await markRepository.save(markExists);

    return response.status(200).json(markEdited);
  },

  async edit(request:Request, response:Response){
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const markRepository = getRepository(Mark);
    const { id } = request.params;
    const { name } = request.body;

    const markExists = await markRepository.findOne({ where: { id } });
    const markExistsWithName = await markRepository.findOne({ where: { name } });

    if (!markExists) {
      return response.status(400).json({ error: "Essa marca não existe" });
    }

    if(markExistsWithName && markExistsWithName.name !== markExists.name){
      return response.status(400).json({ error: "Já existe uma marca com esse nome" });
    }

    const data = {
      name,
    };

    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }
    markRepository.merge(markExists, data);

    const markEdited = await markRepository.save(markExists);

    return response.status(200).json(markEdited);
  },

  async delete(request:Request, response:Response){
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const markRepository = getRepository(Mark);
    const modelRepository = getRepository(Model);

    const { id } = request.params;

    const markExists = await markRepository.findOne({ where: { id } });

    if (!markExists) {
      return response.status(400).json({ error: "Essa marca não existe" });
    }
    
    const results = await markRepository.delete(id);

    const models = await modelRepository.find({ where: { markId:id } });
    
    for (const model in models) {
      if (Object.prototype.hasOwnProperty.call(models, model)) {
        const element = models[model];
        await modelRepository.delete(element.id)
      }
    }
    
    return response.send(results);
  }
};
