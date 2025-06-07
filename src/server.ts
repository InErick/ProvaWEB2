import fastify from "fastify";
import { clientsRoutes } from "./routes/clients";
import { deliverymanRoutes } from "./routes/deliveryman";

const app = fastify();
app.register(clientsRoutes);
app.register(deliverymanRoutes)

app.listen({
    port:3333,
}).then(() => {
    console.log('O server ta rodando em http://localhost:3333');
});