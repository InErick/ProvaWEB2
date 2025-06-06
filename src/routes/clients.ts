import { FastifyInstance } from "fastify";
import { ClientController } from "../controllers/clientController";

const clientController = new ClientController();

export async function clientsRoutes(app: FastifyInstance){
    app.get('/clients',clientController.listALL);
    app.post('/clients',clientController.createClient);
}



