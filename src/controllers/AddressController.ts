import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";
import Address from "../models/Address";

export default {
  async create(request: Request, response: Response) {
    const { id } = request.params;

    if(request.usersId != id && !request.useManager){
      return response.status(401).json({error:"Apenas Administradores ou o proprio usuario pode criar essa rota"})
    }

    const addressRepository = getRepository(Address);
    const userRepository = getRepository(User);

    const { 
      name,
      surname,
      namefirm, 
      cpf, 
      cnpj, 
      nation, 
      cep, 
      street, 
      number, 
      complement, 
      neighborhood, 
      state, 
      phone 
    } = request.body;

    const user = await userRepository.findOne({where: {id}})
    if(!user){
      return response.status(400).json({ error: "Esse usuario não existe" });
    }

    const data = {
      userId: id,
      name,
      surname,
      namefirm, 
      cpf, 
      cnpj, 
      nation, 
      cep, 
      street, 
      number, 
      complement, 
      neighborhood, 
      state, 
      phone
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      surname: Yup.string().required(),
      namefirm: Yup.string(), 
      cpf: Yup.string(), 
      cnpj: Yup.string(), 
      nation: Yup.string().required(), 
      cep: Yup.string().required(), 
      street: Yup.string().required(), 
      number: Yup.string().required(), 
      complement: Yup.string(), 
      neighborhood: Yup.string(), 
      state: Yup.string().required(), 
      phone: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const address = addressRepository.create(data);
    await addressRepository.save(address);

    return response.status(201).json(address);
  },

  async index(request:Request, response: Response){
    const addressRepository = getRepository(Address);

    const address = await addressRepository.find();

    return response.json(address)
  },

  async show(request: Request, response: Response){
    const {id} = request.params;
    const addressRepository = getRepository(Address);

    const address = await addressRepository.find({
      where: {id}
    });

    return response.json(address)
  },

  async update(request: Request, response: Response){
    const { id, idAdress } = request.params;

    if(request.usersId != id && !request.useManager){
      return response.status(401).json({error:"Apenas Administradores ou o proprio usuario pode criar essa rota"})
    }

    const addressRepository = getRepository(Address);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({where: {id}})
    const address:any = await addressRepository.findOne({where: {id: idAdress}})
    if(!user){
      return response.status(400).json({ error: "Esse usuario não existe" });
    }

    if(!address){
      return response.status(400).json({ error: "Endereço não encontrado" });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      surname: Yup.string(),
      namefirm: Yup.string(), 
      cpf: Yup.string(), 
      cnpj: Yup.string(), 
      nation: Yup.string(), 
      cep: Yup.string(), 
      street: Yup.string(), 
      number: Yup.string(), 
      complement: Yup.string(), 
      neighborhood: Yup.string(), 
      state: Yup.string(), 
      phone: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const { 
      name,
      surname,
      namefirm, 
      cpf, 
      cnpj, 
      nation, 
      cep, 
      street, 
      number, 
      complement, 
      neighborhood, 
      state, 
      phone 
    } = request.body;
    
    const data = {
      name,
      surname,
      namefirm, 
      cpf, 
      cnpj, 
      nation, 
      cep, 
      street, 
      number, 
      complement, 
      neighborhood, 
      state, 
      phone
    };

    addressRepository.merge(address, request.body);

    const addressEdited = await addressRepository.save(address);

    return response.status(200).json(addressEdited);
  },

  async delete(request: Request, response: Response){
    const { id } = request.params;

    const addressRepository = getRepository(Address);
    const address = await addressRepository.findOne({
      where: {id}
    })

    if(request.usersId != address?.userId && !request.useManager){
      return response.status(401).json({error:"Apenas Administradores ou o proprio usuario pode criar essa rota"})
    }

    const results = await addressRepository.delete(id);
    return response.send(results);
  }
};
