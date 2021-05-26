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
    const modelRepository = getRepository(Model);
    const { id } = request.params;
    const { name, dimensions, description, weight } = request.body;
    const { filename } = request.file;


    const markExists = await markRepository.findOne({ where: { id } });
    const modelExists = await modelRepository.findOne({ where: { name } });

    if (!markExists) {
      return response.status(400).json({ error: "Essa marca não existe" });
    }

    if(modelExists){
      return response.status(400).json({ error: "Já existe um modelo com esse nome" });
    }

    const data = {
      markId: id,
      name,
      dimensions, 
      description, 
      weight,
      image:filename
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      dimensions: Yup.string().required(),
      description: Yup.string().required(),
      weight: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const model = modelRepository.create(data);
    await modelRepository.save(model);

    return response.status(201).json(model);
  },

  async index(request:Request, response: Response){
    const modelRepository = getRepository(Model);
    const markRepository = getRepository(Mark);

    const models = await modelRepository.find();

    const modelsFormatted = []

    for (const model in models) {
      if (Object.prototype.hasOwnProperty.call(models, model)) {
        const element = models[model];
        const mark = await markRepository.findOne({where: {id: element.markId}})
        const shape = {
          id: element.id,
          name: element.name,
          image: element.image,
          weight: element.weight,
          description: element.description,
          dimensions: element.dimensions,
          nameMark: mark?.name,
          imageMark:mark?.image
        }
        
        modelsFormatted.push(shape)
      }
    }

    return response.json(modelsFormatted)
  },

  async show(request:Request, response: Response){
    const { id } = request.params;

    const modelRepository = getRepository(Model);
    const markRepository = getRepository(Mark);

    const models = await modelRepository.find({where: { markId: id }});

    const modelsFormatted = []

    for (const model in models) {
      if (Object.prototype.hasOwnProperty.call(models, model)) {
        const element = models[model];
        const mark = await markRepository.findOne({where: id})
        const shape = {
          id: element.id,
          name: element.name,
          image: element.image,
          weight: element.weight,
          description: element.description,
          dimensions: element.dimensions,
          nameMark: mark?.name,
          imageMark:mark?.image
        }
        
        modelsFormatted.push(shape)
      }
    }

    return response.json(modelsFormatted)
  },

  async update(request:Request, response:Response){
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }
    const modelRepository = getRepository(Model);

    const { id } = request.params;
    const { filename } = request.file;

    const modelExists:any = await modelRepository.findOne({ where: { id } });

    if (!modelExists) {
      return response.status(400).json({ error: "Essa modelo não existe" });
    }

    const data = {
      image: filename
    };

    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    modelRepository.merge(modelExists, data);

    const modelEdited = await modelRepository.save(modelExists);

    return response.status(200).json(modelEdited);
  },

  async edit(request:Request, response:Response){
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const modelRepository = getRepository(Model);

    const { id } = request.params;
    const { 
      name,
      dimensions, 
      description, 
      weight,
    } = request.body;

    const modelExists = await modelRepository.findOne({ where: { id } });
    const modelExistsWithName = await modelRepository.findOne({ where: { name } });

    if (!modelExists) {
      console.log(modelExists)
      return response.status(400).json({ error: "Esse modelo não existe" });
    }

    if(modelExistsWithName && modelExistsWithName.name !== modelExists.name){
      return response.status(400).json({ error: "Já existe uma marca com esse nome" });
    }    

    const data = {
      name,
      dimensions, 
      description, 
      weight,
    };

    const schema = Yup.object().shape({
      name: Yup.string(),
      dimensions: Yup.string(),
      description: Yup.string(),
      weight: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    modelRepository.merge(modelExists, data);

    const modelEdited = await modelRepository.save(modelExists);

    return response.status(200).json(modelEdited);
  },

  async delete(request:Request, response:Response){
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const modelRepository = getRepository(Model);
    const { id } = request.params;

    const modelExists = await modelRepository.findOne({ where: { id } });

    if (!modelExists) {
      return response.status(400).json({ error: "Essa marca não existe" });
    }

    const results = await modelRepository.delete(id);
    return response.send(results);
  }
};
