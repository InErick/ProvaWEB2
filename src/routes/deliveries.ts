import { FastifyInstance } from "fastify";
import { DeliveryController } from "../controllers/deliveryController";

const deliveryController = new DeliveryController();

export async function deliveryRoutes(app: FastifyInstance) {
  app.post('/deliveries', deliveryController.createDelivery);
  app.get('/deliveries', deliveryController.listAll);
  app.get('/deliveries/:id', deliveryController.getDeliveryById);
  app.put('/deliveries/:id', deliveryController.updateDelivery);

  app.get('/clientorders/:clientId', deliveryController.listOrdersByClientId);
  app.get('/totaldeliveriesstatus', deliveryController.totalDeliveriesStatus);
  app.get('/gains', deliveryController.deliveryGains);
  app.get('/bestdeliveryman', deliveryController.bestDeliveryman);  
}
