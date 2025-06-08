import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export class DeliveryController {

    // POST – Criar nova entrega
  async createDelivery(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      clientId: z.string().uuid(),
      deliverymanId: z.string().uuid(),
      product: z.string(),
      price: z.number(),
      deliveryDate: z.coerce.date(), // Aceita string e converte
      status: z.enum(["CANCELLED", "IN_PROGRESS", "DELIVERED"]),
    });

    const data = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.create({ data });

    return reply.status(201).send({
      message: "Entrega criada com sucesso!",
      delivery,
    });
  }

  async listAll(request: FastifyRequest, reply: FastifyReply) {
  const deliveries = await prisma.delivery.findMany({
    orderBy: {
      deliveryDate: 'desc',
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
      deliveryman: {
        select: {
          name: true,
        },
      },
    },
  });

  return reply.send(deliveries);
}

  // GET – Buscar entrega por ID
  async getDeliveryById(request: FastifyRequest, reply: FastifyReply) {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramSchema.parse(request.params);

    const delivery = await prisma.delivery.findFirstOrThrow({
      where: { id },
    });

    return reply.send(delivery);
  }

  // PUT – Atualizar entrega
  async updateDelivery(request: FastifyRequest, reply: FastifyReply) {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      clientId: z.string().uuid(),
      deliverymanId: z.string().uuid(),
      product: z.string(),
      price: z.number(),
      deliveryDate: z.coerce.date(),
      status: z.enum(["CANCELLED", "IN_PROGRESS", "DELIVERED"]),
    });

    const { id } = paramSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.update({
      where: { id },
      data,
    });

    return reply.send({
      message: "Entrega atualizada com sucesso!",
      delivery,
    });
  }


  async listOrdersByClientId(request: FastifyRequest, reply: FastifyReply) {
    const paramSchema = z.object({
      clientId: z.string().uuid(),
    });

    const { clientId } = paramSchema.parse(request.params);

    const orders = await prisma.delivery.findMany({
      where: { clientId },
      select: {
        product: true,
        price: true,
        status: true,
      },
      orderBy: {
        deliveryDate: "desc",
      },
    });

    return reply.send(orders);
  }

  async totalDeliveriesStatus(request: FastifyRequest, reply: FastifyReply) {
  const total = await prisma.delivery.count();

  const cancelled = await prisma.delivery.count({
    where: { status: 'CANCELLED' }
  });

  const inProgress = await prisma.delivery.count({
    where: { status: 'IN_PROGRESS' }
  });

  const delivered = await prisma.delivery.count({
    where: { status: 'DELIVERED' }
  });

  return reply.send({
    totalDeliveries: total,
    cancelledDeliveries: {
      count: cancelled,
      percentage: total === 0 ? 0 : ((cancelled / total) * 100).toFixed(2) + '%'
    },
    deliveriesInProgress: {
      count: inProgress,
      percentage: total === 0 ? 0 : ((inProgress / total) * 100).toFixed(2) + '%'
    },
    finishedDeliveries: {
      count: delivered,
      percentage: total === 0 ? 0 : ((delivered / total) * 100).toFixed(2) + '%'
    }
  });
}

async deliveryGains(request: FastifyRequest, reply: FastifyReply) {
    const result = await prisma.delivery.aggregate({
      _sum: {
        price: true,
      },
      where: {
        status: 'DELIVERED',
      },
    });

    return reply.send({
      deliveryGains: result._sum.price ?? 0,
    });
  }

  async bestDeliveryman(request: FastifyRequest, reply: FastifyReply) {
    const results = await prisma.delivery.groupBy({
      by: ['deliverymanId'],
      where: {
        status: 'DELIVERED',
      },
      _sum: {
        price: true,
      },
      orderBy: {
        _sum: {
          price: 'desc',
        },
      },
    });

    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const deliveryman = await prisma.deliveryman.findUnique({
          where: { id: result.deliverymanId },
        });

        return {
          deliverymanName: deliveryman?.name ?? 'Desconhecido',
          totalDeliveredValue: result._sum.price ?? 0,
        };
      })
    );

    return reply.send({
      bestPerformance: enrichedResults,
    });
  }
  
}
