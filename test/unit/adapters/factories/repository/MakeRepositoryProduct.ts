/* eslint-disable default-param-last */

import { CategoriesEnum } from "@/core/domain/enums/CategoriesEnum";
import { faker } from "@faker-js/faker";
import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { getRandomEnumValue } from "@test/unit/utils/GetRandomEnumValue";

export function makeRepositoryProduct(
  override: Partial<Product> = {}
): Product {
  const repositoryProduct = {
    id: faker.string.uuid(),
    active: faker.datatype.boolean(),
    category: getRandomEnumValue(CategoriesEnum),
    created_at: faker.date.recent(),
    description: faker.lorem.sentence(),
    name: faker.lorem.words(),
    price: new Decimal(faker.number.float()),
    updated_at: faker.date.recent(),
    ...override,
  } as Product;

  return repositoryProduct;
}
