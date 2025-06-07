import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import {z} from 'zod';


export class ClientController {
    async listALL(request: FastifyRequest, reply: FastifyReply){
        const clients = await prisma.client.findMany({
            orderBy:{
                name: 'asc'
            }
        })
        return clients
    }

    async createClient(request: FastifyRequest, reply: FastifyReply){
        const bodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
            deliveryAddress: z.string()
        });

        const {name, email, phone, deliveryAddress} = bodySchema.parse(request.body);

        const client = await prisma.client.create({
            data:{
                name,
                email,
                phone,
                deliveryAddress
            }
        });

        return reply.status(201).send({
            message: "Cliente criado com sucesso!",
            client
        });
    }

    async listClientById(request: FastifyRequest, reply: FastifyReply){
        const paramSchema = z.object({
            id: z.string().uuid(),
        })

        const {id} = paramSchema.parse(request.params)

        const client = await prisma.client.findFirstOrThrow({
            where : {
                id,
            }
        })
        return client;
    }

    
}
