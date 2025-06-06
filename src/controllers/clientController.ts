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
}