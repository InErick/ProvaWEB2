import fastify from "fastify";
import 'dotenv/config';
import { clientsRoutes } from "./routes/clients";
import { deliverymanRoutes } from "./routes/deliveryMan";
import { deliveryRoutes } from "./routes/deliveries";

const app = fastify();
app.register(clientsRoutes);
app.register(deliverymanRoutes)
app.register(deliveryRoutes);

app.listen({
    port:3333,
}).then(() => {
    console.log('O server ta rodando em http://localhost:3333');
});