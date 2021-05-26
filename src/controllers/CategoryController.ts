import { Request, Response } from "express";
import { getRepository } from "typeorm";

import Category from '../models/Category'

export default {
    async create(request: Request, response: Response) {
        if(!request.useManager){
            return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
        }

        const { name } = request.body;
        const { filename } = request.file;


        if(!name){
            return response.status(400).json({ error: "Preencha todos os campos."})
        }

        const categoryRepository = getRepository(Category);

        const categoryExists = await categoryRepository.findOne({where: {name}})

        if(categoryExists){
            return response.status(400).json({ error: "Essa categoria já existe."})
        }

        const data = {
            name,
            image: filename
        }

        const category = categoryRepository.create(data);
        await categoryRepository.save(category);

        return response.status(200).json(category);
    }, 
    
    async index(request: Request, response: Response){
        const categoryRepository = getRepository(Category);
        const categories = await categoryRepository.find();

        return response.json(categories)
    },

    async delete(request: Request, response: Response){
        if(!request.useManager){
            return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
        }

        const categoryRepository = getRepository(Category);

        const { id } = request.params;

        const category = await categoryRepository.findOne({ where: { id }});

        if(!category){
            return response.status(400).json({ error: "Essa categoria não existe." })
        }
        
        const results = await categoryRepository.delete(id);

        return response.status(200).json(results)
    },

    async update(request: Request, response: Response) {
        if(!request.useManager){
            return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
        }

        const categoryRepository = getRepository(Category);

        const { filename } = request.file;
        const { id } = request.params;

        const category = await categoryRepository.findOne({ where: { id } })
        
        if(!category){
            return response.status(400).json({ error: "Essa categoria não existe."})
        }

        const data = {
            image:filename,
        }

        categoryRepository.merge(category, data);

        const categoryEdited = await categoryRepository.save(category);

        return response.status(200).json(categoryEdited)
    },

    async put(request: Request, response: Response) {
        if(!request.useManager){
            return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
        }

        const categoryRepository = getRepository(Category);

        const { id } = request.params;
        const { name } = request.body;

        const category = await categoryRepository.findOne({ where: { id } })
        
        if(!category){
            return response.status(400).json({ error: "Essa categoria não existe."})
        }

        if(!name){
            return response.status(400).json({ error: "Preencha todos os campos."})
        }

        const categoryExists = await categoryRepository.findOne({ where: {name}});

        if(categoryExists && categoryExists.id !== Number(id)){
            return response.status(400).json({ error: "Já existe uma categoria com esse nome." })
        }


        const data = {
            name
        }

        categoryRepository.merge(category, data);

        const categoryEdited = await categoryRepository.save(category);

        return response.status(200).json(categoryEdited)
    }
}