/* eslint-disable default-param-last */

import { faker } from "@faker-js/faker";
import { ComboProduct } from "@prisma/client";

export function MakeRepositoryComboProduct(): ComboProduct {
  const repositoryComboProduct = {
    id: faker.string.uuid(),
    combo_id: faker.string.uuid(),
    product_id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
  } as ComboProduct;

  return repositoryComboProduct;
}
