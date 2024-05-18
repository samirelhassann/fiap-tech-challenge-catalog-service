/* eslint-disable default-param-last */

import { faker } from "@faker-js/faker";
import { Combo } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export function makeRepositoryCombo(override: Partial<Combo> = {}): Combo {
  const repositoryCombo = {
    created_at: faker.date.recent(),
    description: faker.lorem.sentence(),
    id: faker.string.uuid(),
    name: faker.lorem.words(),
    price: new Decimal(faker.number.float()),
    updated_at: faker.date.recent(),
    ...override,
  } as Combo;

  return repositoryCombo;
}
