import * as Yup from "yup";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

import Order from "../models/Order";
import User from "../models/User";
import Address from "../models/Address";
import Product from "../models/Product";

export default {
  async create(request: Request, response: Response) {
    const { id } = request.params;

    if(request.usersId != id && !request.useManager){
      return response.status(401).json({error:"Apenas Administradores ou o proprio usuario pode criar essa rota"})
    }

    const orderRepository = getRepository(Order);
    const userRepository = getRepository(User);
    const addressRepository = getRepository(Address);
    const productRepository = getRepository(Product);

    const { 
      addressId,
      addressIdDelivery,
      productsIds,
      subTotal,
      frete,
      total,
      comments
    } = request.body;

    const user = await userRepository.findOne({where: { id }})
    if(!user){
      return response.status(400).json({ error: "Esse usuario não existe" });
    }

    const schema = Yup.object().shape({
      addressId: Yup.string().required(),
      addressIdDelivery: Yup.string().required(),
      productsIds: Yup.string().required(),
      subTotal: Yup.string().required(),
      frete: Yup.string().required(),
      total: Yup.string().required(),
      comments: Yup.string().required(),      
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const data = {
      userId: id,
      addressId,
      addressIdDelivery,
      productsIds,
      productsCreatedIds: "none",
      subTotal,
      frete,
      status: "Aguardando Pagamento",
      statusColor: "#ffba00",
      total,
      comments
    };

    const addressExists = await addressRepository.findOne({ where: {id: addressId} })
    const addressDeliveryExists = await addressRepository.findOne({ where: {id: addressIdDelivery} })

    if(!addressExists || !addressDeliveryExists){
      return response.status(400).json({ error: "Esse endereço não existe" });
    }

    const arrayProductsIds = productsIds.split(",")

    for (const key in arrayProductsIds) {
      if (Object.prototype.hasOwnProperty.call(arrayProductsIds, key)) {
        const element = arrayProductsIds[key];
        const [, , productId] = element.split("_")

        const productExists = await productRepository.findOne({ where: {id: productId} })
        if(!productExists){
          return response.status(400).json({ error: "Esse produto não existe." });
        }
      }
    }

    const order = orderRepository.create(data);

    await orderRepository.save(order)

    return response.status(201).json(order);
  },

  async index(request:Request, response: Response){
    const orderRepository = getRepository(Order);
    const userRepository = getRepository(User);
    const addressRepository = getRepository(Address);
    const productRepository = getRepository(Product);

    const orders = await orderRepository.find();

    const ordersFormatted = []

    for (const key in orders) {
      if (Object.prototype.hasOwnProperty.call(orders, key)) {
        const element = orders[key];

        const products = [];
        
        const arrayProductsIds = element.productsIds.split(",")
        for (const key in arrayProductsIds) {
          if (Object.prototype.hasOwnProperty.call(arrayProductsIds, key)) {
            const element = arrayProductsIds[key];
            const [, , productId] = element.split("_")

            const productExists = await productRepository.findOne({ where: {id: productId} })
            products.push(productExists)
          }
        }

        const user = await userRepository.findOne({ where: {id: element.userId} })
        const address = await addressRepository.findOne({ where: {id: element.addressId} })
        const addressDelivery = await addressRepository.findOne({ where: {id: element.addressIdDelivery} })

        const shape = {
          id: element.id,
          status: element.status,  
          statusColor: element.statusColor,
          comments: element.comments,
          user,
          address,
          addressDelivery,
          products,
          productsIds : element.productsIds,
          subTotal : element.subTotal,
          frete : element.frete,
          total : element.total,
        }

        ordersFormatted.push(shape)
      }
    }

    return response.json(ordersFormatted)
  },

  async show(request: Request, response: Response){
    const {id} = request.params;

    const orderRepository = getRepository(Order);
    const userRepository = getRepository(User);
    const addressRepository = getRepository(Address);
    const productRepository = getRepository(Product);

    const order:any = await orderRepository.findOne({
      where: {id}
    });

    if(!order){
      return response.status(400).json({error:"Pedido não encontrado."})
    }

    const products = [];
    const arrayProductsIds = order.productsIds.split(",")
    for (const key in arrayProductsIds) {
      if (Object.prototype.hasOwnProperty.call(arrayProductsIds, key)) {
        const order = arrayProductsIds[key];
        const [, , productId] = order.split("_")
        const productExists = await productRepository.findOne({ where: {id: productId} })
        products.push(productExists)
      }
    }

    const user = await userRepository.findOne({ where: {id: order.userId} })
    const address = await addressRepository.findOne({ where: {id: order.addressId} })
    const addressDelivery = await addressRepository.findOne({ where: {id: order.addressIdDelivery} })
  
    const orderFormatted = {
      id: order.id,
      status: order.status,
      statusColor: order.statusColor,
      comments: order.comments,
      user,
      address,
      addressDelivery,
      products,
      productsIds : order.productsIds,
      subTotal : order.subTotal,
      frete : order.frete,
      total : order.total,
    }

    return response.json(orderFormatted)
  },

  async updateStatusToPago(request: Request, response: Response){
    const {id} = request.params;

    const orderRepository = getRepository(Order);

    const order:any = await orderRepository.findOne({
      where: {id}
    });

    if(!order){
      return response.status(400).json({error:"Pedido não encontrado."})
    }

    orderRepository.merge(order, {status: "Pagamento efetuado", statusColor: "#30e630"});

    const orderEdited = await orderRepository.save(order);
   
    return response.json(orderEdited)
  },

  async delete(request: Request, response: Response){
    const { id } = request.params;

    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: {id}
    })

    if(!order){
      return response.status(401).json({error:"Pedido não encontrado."})
    }

    if(!request.useManager){
      return response.status(401).json({error:"Apenas Administradores ou o proprio usuario pode criar essa rota."})
    }

    const results = await orderRepository.delete(id);
    return response.send(results);
  }
};
