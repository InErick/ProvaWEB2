import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import {z} from 'zod';

export class DeliverymanController{
    async listALL(request: FastifyRequest, reply:FastifyReply){
        const deliveryman = await prisma.deliveryman.findMany({
            orderBy:{
                name: 'asc'
            }
        })
        return deliveryman
    }

    async createDeliveryman(request: FastifyRequest, reply: FastifyReply){
        const bodySchema = z.object({
            name: z.string(),
            phone: z.string(),
            deliveryVehicle: z.string()
        });

        const {name, phone, deliveryVehicle} = bodySchema.parse(request.body);

        const deliveryman = await prisma.deliveryman.create({
            data: {name, phone, deliveryVehicle}
        });
        return reply.status(201).send({
            message:"Entregador criado com sucesso",
            deliveryman
        })
    }

    async listDeliverymanById(request: FastifyRequest, reply: FastifyReply){
        const paramSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramSchema.parse(request.params);

        const deliveryman = await prisma.deliveryman.findFirstOrThrow({
            where: {id}
        })
        return deliveryman;
    }

    async updateDeliveryman(request:FastifyRequest, reply: FastifyReply){
        const paramSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            name: z.string(),
            phone: z.string(),
            deliveryVehicle: z.string()
        })

        const {id} = paramSchema.parse(request.params);
        const {name, phone, deliveryVehicle} = bodySchema.parse(request.body);

        const deliveryman = await prisma.deliveryman.update({
            where: {id},
            data: {name, phone, deliveryVehicle}
        })
        return reply.send({ 
            message: "Entregador atualizado com sucesso!", 
            deliveryman 
        });
    }
}