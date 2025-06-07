import { FastifyInstance } from "fastify";
import { DeliverymanController } from "../controllers/deliverymanControllers";

const deliverymanController = new DeliverymanController();

export async function deliverymanRoutes(app: FastifyInstance) {
    app.get('/deliveryman', deliverymanController.listALL);
    app.post('/deliveryman', deliverymanController.createDeliveryman);
    app.get('/deliveryman/:id', deliverymanController.listDeliverymanById);
    app.put('/deliveryman/:id', deliverymanController.updateDeliveryman);
}