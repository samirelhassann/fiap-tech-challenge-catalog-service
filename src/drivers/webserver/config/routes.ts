import { FastifyInstance } from "fastify";

import identifyRequest from "@/adapters/middlewares/identifyRequest";

import { ComboRoutes } from "../routes/ComboRoutes";
import { HealhCheckRoutes } from "../routes/HealhCheckRoutes";
import { ProductRoutes } from "../routes/ProductRoutes";

const SERVICE_PREFIX = "/catalog-service";

export function routes(app: FastifyInstance) {
  app.addHook("preHandler", identifyRequest);

  app.register(HealhCheckRoutes);

  app.register(ComboRoutes, { prefix: `${SERVICE_PREFIX}/combos` });
  app.register(ProductRoutes, { prefix: `${SERVICE_PREFIX}/products` });
}
