import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Assets from "../models/Assets";

export default {
  async create(request: Request, response: Response) {
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota"})
    }

    const assetsRepository = getRepository(Assets);

    let { name, background } = request.body;
    const { filename } = request.file;

    const assetsExists = await assetsRepository.findOne({ where: { name }});

    if(assetsExists){
      return response.status(400).json({error:"Já existe uma imagem com esse nome."})
    }

    if(!background){
      background = false;
    }

    if(background){
      background = true;
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const data = {
      name,
      background,
      image: filename
    }

    const assets = assetsRepository.create(data);
    await assetsRepository.save(assets);

    return response.status(201).json(assets);
  },

  async index(request: Request, response: Response) {
    const assetsRepository = getRepository(Assets);

    const assets = await assetsRepository.find({ where: { background: true}})

    return response.status(200).json(assets);
  },

  async show(request: Request, response: Response) {
    const assetsRepository = getRepository(Assets);

    const assets = await assetsRepository.find({ where: { background: false}})

    return response.status(200).json(assets);
  },

  
  async update(request: Request, response: Response) {
    const assetsRepository = getRepository(Assets);

    if(!request.useManager){
      return response.status(401).json({ error: "Apenas Administradores podem acessar essa rota."})
    }

    const { id } = request.params;
    const { filename } = request.file;

    const assets = await assetsRepository.findOne({ where: { id: id}});

    if(!assets){
      return response.status(400).json({ error: "Imagem não encontrada."})
    }

    const data = {
      image: filename
    };

    assetsRepository.merge(assets, data)

    const results = await assetsRepository.save(assets);
    return response.send(results);
  },

  async put(request: Request, response: Response) {
    const assetsRepository = getRepository(Assets);

    if(!request.useManager){
      return response.status(401).json({ error: "Apenas Administradores podem acessar essa rota."})
    }

    const { id } = request.params;
    const { name } = request.body;

    const assets = await assetsRepository.findOne({ where: { id: id}});

    if(!assets){
      return response.status(400).json({ error: "Imagem não encontrada."})
    }
    
    const data = {
      name
    };

    assetsRepository.merge(assets, data)

    const results = await assetsRepository.save(assets);
    return response.send(results);
  },

  async delete(request: Request, response: Response) {
    const assetsRepository = getRepository(Assets);

    if(!request.useManager){
      return response.status(401).json({ error: "Apenas Administradores podem acessar essa rota."})
    }

    const { id } = request.params;

    const assets = await assetsRepository.findOne({ where: { id: id}});

    if(!assets){
      return response.status(400).json({ error: "Imagem não encontrada."})
    }

    const results = await assetsRepository.delete(id);
    return response.send(results);
  },
}