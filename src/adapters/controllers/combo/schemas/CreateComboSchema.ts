import { z } from "zod";

import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";
import { generateSchemaFromSampleObject } from "@/drivers/webserver/utils/generateSchemaFromSampleObject";

import { CreateComboViewModel } from "../viewModels/CreateComboViewModel";
import { tag } from "./constants";

export const createComboPayloadSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  sandwichId: z.string().optional(),
  drinkId: z.string().optional(),
  sideId: z.string().optional(),
  dessertId: z.string().optional(),
});

const responseExample: CreateComboViewModel = {
  id: "1",
  name: "Combo 1",
  description: "Combo 1 description",
  price: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  products: [
    {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      price: 50,
      category: "Category 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export const createComboDocSchema = {
  tags: [tag],
  description: `Create ${tag}`,
  params: convertZodSchemaToDocsTemplate({
    schema: createComboPayloadSchema,
  }),
  response: {
    200: generateSchemaFromSampleObject(responseExample),
  },
};
