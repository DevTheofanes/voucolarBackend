import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

import Product from "../models/Product";
import Category from "../models/Category";
import Model from "../models/Model";


export default {
  async create(request: Request, response: Response) {
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
    }

    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(Category);

    const { categoryId } = request.params;
    const { filename } = request.file;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      value: Yup.string().required(),
      valueNotDiscount: Yup.string(),
      idsModelsWithoutCustomization: Yup.string(),
    })
    if(!(await schema.isValid(request.body))){
      return response.status(400).json({ error: "Erro na validação, por favor preencha os dados corretamente."})
    }

    const categoryExists = await categoryRepository.findOne({ where: { id: categoryId}})

    if(!categoryExists){
      return response.status(400).json({ error: "Essa categoria não foi encontrada."})
    }

    const {
      name,
      value,
      valueNotDiscount,
      idsModelsWithoutCustomization
    } = request.body;

    const data = {
      name,
      categoryId,
      image: filename,
      value,
      valueNotDiscount,
      idsModelsWithoutCustomization
    }

    const product = productRepository.create(data);

    await productRepository.save(product)

    return response.status(200).json(product)

  },

  async show(request: Request, response: Response){
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(Category);

    const { categoryId } = request.params;

    const categoryExists = await categoryRepository.findOne({ where: {id: categoryId}})

    if(!categoryExists){
      return response.status(400).json({ error: "Essa categoria não foi encontrada."})
    }

    const products = await productRepository.find({where: {categoryId}});

    const productsList = []

    for (const key in products) {
      if (Object.prototype.hasOwnProperty.call(products, key)) {
        const element = products[key];

        const category: any = await categoryRepository.findOne({ where: { id: element.categoryId } })

        const shape = {
          id: element.id,
          name: element.name,
          image: element.image,
          value: element.value,
          valueNotDiscount: element.valueNotDiscount,
          idsModelsWithoutCustomization: element.idsModelsWithoutCustomization,
          category: {
            id: element.categoryId,
            name: category.name
          }
        }

        productsList.push(shape)
      }
    }

    return response.status(200).json({
      name: categoryExists.name,
      products : productsList
    })
  },

  async index(request: Request, response: Response) {
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(Category);

    const products = await productRepository.find()

    const productsList = []

    for (const key in products) {
      if (Object.prototype.hasOwnProperty.call(products, key)) {
        const element = products[key];

        const category: any = await categoryRepository.findOne({ where: { id: element.categoryId } })

        const shape = {
          id: element.id,
          name: element.name,
          image: element.image,
          value: element.value,
          valueNotDiscount: element.valueNotDiscount,
          idsModelsWithoutCustomization: element.idsModelsWithoutCustomization,
          category: {
            id: element.categoryId,
            name: category.name
          }
        }

        productsList.push(shape)
      }
    }


    return response.status(200).json(productsList)
  },

  async update(request: Request, response: Response) {
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
    }

    const productRepository = getRepository(Product);

    const { id } = request.params;
    const { filename } = request.file;

    const product = await productRepository.findOne({ where: { id }})

    if(!product){
      return response.status(400).json({ error: "Esse produto não existe."})
    }

    const data = {
      image: filename
    }

    productRepository.merge(product, data);

    const productEdited = await productRepository.save(product);

    return response.status(200).json(productEdited);
  },


  async put(request: Request, response: Response) {
    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores podem acessar essa rota."})
    }

    const productRepository = getRepository(Product);

    const { id } = request.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      value: Yup.string(),
      valueNotDiscount: Yup.string(),
      idsModelsWithoutCustomization: Yup.string(),
    })
    if(!(await schema.isValid(request.body))){
      return response.status(400).json({ error: "Erro na validação, por favor preencha os dados corretamente."})
    }

    const product = await productRepository.findOne({ where: { id }})

    if(!product){
      return response.status(400).json({ error: "Esse produto não existe."})
    }

    const {
      name,
      value,
      valueNotDiscount,
      idsModelsWithoutCustomization
    } = request.body;

    const data = {
      name,
      value,
      valueNotDiscount,
      idsModelsWithoutCustomization
    }

    productRepository.merge(product, data);

    const productEdited = await productRepository.save(product);

    return response.status(200).json(productEdited);
  },

  async delete(request: Request, response: Response) {
    const productRepository = getRepository(Product);

    const { id } = request.params;

    const productExists = await productRepository.findOne({ where: {id}})

    if(!productExists){
      return response.status(400).json({ error: "Produto não encontrado."})
    }

    const results = await productRepository.delete(id);
    return response.send(results);
  },

  async showProductsForModel(request: Request, response: Response){
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(Category);
    const modelRepository = getRepository(Model);

    const { id } = request.params;

    const modelExists = await modelRepository.findOne({ where: {id}})

    if(!modelExists){
      return response.status(400).json({ error: "Esse modelo não foi encontrado."})
    }

    const products = await productRepository.find()

    let productsForCustomization = []

    for (const key in products) {
      if (Object.prototype.hasOwnProperty.call(products, key)) {
        const element = products[key];

        const modelWithoutCustomization = element.idsModelsWithoutCustomization.indexOf(id) > -1;

        if(!modelWithoutCustomization){
          productsForCustomization.push(element)
        }
      }
    }

    const productsList = []

    for (const key in productsForCustomization) {
      if (Object.prototype.hasOwnProperty.call(productsForCustomization, key)) {
        const element = productsForCustomization[key];

        const category: any = await categoryRepository.findOne({ where: { id: element.categoryId } })

        const shape = {
          id: element.id,
          name: element.name,
          image: element.image,
          value: element.value,
          valueNotDiscount: element.valueNotDiscount,
          idsModelsWithoutCustomization: element.idsModelsWithoutCustomization,
          category: {
            id: element.categoryId,
            name: category.name
          }
        }

        productsList.push(shape)
      }
    }

    return response.status(200).json(productsList)
  },

  async showProduct(request: Request, response: Response){
    const productRepository = getRepository(Product);
    const categoryRepository = getRepository(Category);

    const { id } = request.params;

    const product = await productRepository.findOne({ where: { id } })

    if(!product){
      return response.status(400).json({ error: "Esse produto não existe."})
    }

    const category = await categoryRepository.findOne({ where: { id: product?.categoryId }})

    const shape = {
      ...product,

      category: {
        ...category
      }
    }


    return response.status(200).json(shape)
  }
}