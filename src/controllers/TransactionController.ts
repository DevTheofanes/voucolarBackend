import * as Yup from "yup";
import pagarme from 'pagarme'

import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";
import Address from "../models/Address";
import Product from "../models/Product";
// import CartData from "../models/CartData";
// import Transaction from "../models/Transaction";
import Order from "../models/Order";

export default {
  async create(request: Request, response: Response) {
    const userId = request.usersId;
    const { orderId } = request.params

    const usersRepository = getRepository(User);
    const ordersRepository = getRepository(Order);
    const addressesRepository = getRepository(Address);
    const productRepository = getRepository(Product);

    const schema = Yup.object().shape({
      payment_method: Yup.string().required(),
      card_number: Yup.string(),
      card_cvv: Yup.string(),
      card_expiration_date: Yup.string(),
      card_holder_name: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(401).json({ error: "Validation Fails" });
    }

    const data:any = request.body;
    let responseApi:any = {error: "Tipo de pagamento invalido."}

    const user = await usersRepository.findOne({where : { id: userId }})
    const order = await ordersRepository.findOne({where : { id: orderId }})

    if(!order){
      return response.status(400).json({ error: "Pedido não encontrado." });
    }

    const address = await addressesRepository.findOne({where : { id: order?.addressId }})
    const addressDelivery = await addressesRepository.findOne({where : { id: order?.addressIdDelivery }})

    const productsList = order.productsIds.split(",")

    const products:any = []

    for (const key in productsList) {
      if (Object.prototype.hasOwnProperty.call(productsList, key)) {
        const element = productsList[key];
        const [, , productId, , quantity] = element.split("_")

        const productExists = await productRepository.findOne({ where: {id: productId} })

        if(!productExists){
          return response.status(400).json({ error: "Esse produto não existe." });
        }

        const shape = {
          id: productExists.id,
          "title": productExists.name,
          "unit_price": productExists.value,
          quantity,
          "tangible": true
        }

        products.push(shape)
      }
    }

    if(data.payment_method === "boleto"){
      try {
        const client:any = await pagarme.client.connect({ api_key: 'ak_live_fuiT9YVp5dqHRnuum3zJbKOqyxaBuu' })
        const response = await client.transactions.create({
          "amount": Number(order.total) * 100,
          "payment_method":data?.payment_method,
          "customer": {
            "external_id": userId,
            "name": user?.name,
            "type": "individual",
            "country": "br",
            "email": user?.email,
            "documents": [
              {
                "type": "cpf",
                "number": addressDelivery?.cpf
              }
            ],
            "phone_numbers": ["+55" + addressDelivery?.phone],
            "document_number": addressDelivery?.cpf,
            "birthday": "1965-01-01"
              },
          "billing": {
            "name": address?.name,
            "address": {
              "country": "br",
              "state": address?.state,
              "city": "Cotia",
              "neighborhood": address?.neighborhood,
              "street": address?.street,
              "street_number": address?.number,
              "zipcode": address?.cep
                }
              },
          "items": [...products]
        })

        // console.log(response)
        responseApi = {
          status: response.status,
          boleto_url: response.boleto_url,
          boleto_barcode: response.boleto_barcode,
          boleto_expiration_date: response.boleto_expiration_date,
        }
        // console.log(responseApi)
      } catch (error) {
        console.error("DEU RUIM")
      }
    }

    if(data.payment_method === "credit_card"){
      // try {
      //   const client:any = await pagarme.client.connect({ api_key: 'ak_live_fuiT9YVp5dqHRnuum3zJbKOqyxaBuu' })
      //   const response = await client.transactions.create({
      //     // "amount": Number(order.total) * 100,
      //     "amount": 100,
      //     "card_number": data.card_number,
      //     "card_cvv": data.card_cvv,
      //     "card_expiration_date": data.card_expiration_date,
      //     "card_holder_name": data.card_holder_name,
      //     "customer": {
      //       "external_id": userId,
      //       "name": user?.name,
      //       "type": "individual",
      //       "country": "br",
      //       "email": user?.email,
      //       "documents": [
      //         {
      //           "type": "cpf",
      //           "number": addressDelivery?.cpf
      //         }
      //       ],
      //       "address": {
      //         "country": "br",
      //         "state": address?.state,
      //         "city": "Cotia",
      //         "neighborhood": address?.neighborhood,
      //         "street": address?.street,
      //         "street_number": address?.number,
      //         "zipcode": address?.cep
      //       },
      //       "phone_numbers": ["+55" + addressDelivery?.phone],
      //       "phone": {
      //         "ddd":"11",
      //         "number":"999998888",
      //       },
      //       "document_number": addressDelivery?.cpf,
      //       "birthday": "1965-01-01"
      //     },
      //     "billing": {
      //       "name": address?.name,
      //       "address": {
      //         "country": "br",
      //         "state": address?.state,
      //         "city": "Cotia",
      //         "neighborhood": address?.neighborhood,
      //         "street": address?.street,
      //         "street_number": address?.number,
      //         "zipcode": address?.cep
      //       }
      //     },
      //     "items": [...products]
      //   })
      //   console.log(response)
      //   responseApi = {
      //     status: response.status,
      //     // boleto_url: response.boleto_url,
      //     // boleto_barcode: response.boleto_barcode,
      //     // boleto_expiration_date: response.boleto_expiration_date,
      //   }
      //   // console.log(responseApi)
      // } catch (error) {
      //   console.error("DEU RUIM")
      //   console.log(error.response)
      //   responseApi = {
      //     error: "DEU ZEBRA",
      //     errorLog: error.response.errors
      //   }
      // }

      pagarme.client.connect({ api_key: 'ak_live_fuiT9YVp5dqHRnuum3zJbKOqyxaBuu' })
    .then((client:any) => client.transactions.create({
      amount: 6000,  
      payment_method:'credit_card',
      // card_hash:cardHash,
      // card_number: data.card_number,
      // card_cvv: data.card_cvv,
      // card_expiration_date: data.card_expiration_date,
      // card_holder_name: data.card_holder_name,
      card_number: "4111111111111111",
      card_cvv: "123",
      card_expiration_date: "0922",
      card_holder_name: "Morpheus Fishburne",
      customer: {
        name: user?.name,
        external_id: user?.id,
        email: user?.email,
        type: "individual",
        country: "br",
        phone_numbers: ["+"+"5511999706188"],
        documents: [
          {
            type: "cpf",
            number: "30621143049"
          }
        ],
      }, 

      billing: {
        name: address?.name,
        address: {
          country: "br",
          state: address?.state,
          city: "Cotia",
          neighborhood: address?.neighborhood,
          street: address?.street,
          street_number: address?.number,
          zipcode: address?.cep
        }
      },

      items:[
        {
          id:"1",
          title:"Parcela mensal do aplicativo do dev doido",
          unit_price:30, 
          quantity:1, 
          tangible:true 
        }
      ], 
      
      metadata: { idProduto : '1'}
    }))
    .then(transaction => console.log(transaction))
      }

    return response.json(responseApi)
  }
};
