import { describe, beforeEach, vi, expect, it } from "vitest";

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { EntityNotActiveError } from "@/core/domain/base/errors/useCases/EntityNotActiveError";
import { MinimumResourcesNotReached } from "@/core/domain/base/errors/useCases/MinimumResourcesNotReached";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { Combo } from "@/core/domain/entities/Combo";
import { ComboProduct } from "@/core/domain/entities/ComboProduct";
import { ComboProductList } from "@/core/domain/entities/ComboProductList";
import { IComboRepository } from "@/core/interfaces/repositories/IComboRepository";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";
import { ComboUseCase } from "@/core/useCases/combo/ComboUseCase";
import { CreateComboUseCaseRequestDTO } from "@/core/useCases/combo/dto/CreateComboUseCaseDTO";
import { IComboUseCase } from "@/core/useCases/combo/IComboUseCase";
import { faker } from "@faker-js/faker";
import { makeProduct } from "@test/unit/adapters/factories/MakeProduct";

let comboRepository: IComboRepository;
let productRepository: IProductRepository;
let sut: IComboUseCase;

describe("CreateComboUseCase", () => {
  beforeEach(() => {
    comboRepository = {
      findMany: vi.fn(),
      findManyByIds: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as IComboRepository;

    productRepository = {
      findByIdAndCategory: vi.fn(),
      findManyByIds: vi.fn(),
    } as unknown as IProductRepository;

    sut = new ComboUseCase(comboRepository, productRepository);
  });

  it.skip("should create the combo properly", async () => {
    const request: CreateComboUseCaseRequestDTO = {
      description: faker.lorem.sentence(),
      name: faker.lorem.word(),
      dessertId: faker.string.uuid(),
      drinkId: faker.string.uuid(),
      sandwichId: faker.string.uuid(),
      sideId: faker.string.uuid(),
    };

    const mockedSandwich = makeProduct(
      {},
      new UniqueEntityId(request.sandwichId)
    );
    const mockedDrink = makeProduct({}, new UniqueEntityId(request.drinkId));
    const mockedSide = makeProduct({}, new UniqueEntityId(request.sideId));
    const mockedDessert = makeProduct(
      {},
      new UniqueEntityId(request.dessertId)
    );

    vi.mocked(productRepository.findByIdAndCategory)
      .mockResolvedValueOnce(mockedSandwich)
      .mockResolvedValueOnce(mockedDrink)
      .mockResolvedValueOnce(mockedSide)
      .mockResolvedValueOnce(mockedDessert);

    const productsArray = [
      mockedSandwich,
      mockedDrink,
      mockedSide,
      mockedDessert,
    ];

    vi.mocked(productRepository.findManyByIds).mockResolvedValueOnce([
      makeProduct({}, new UniqueEntityId(request.sandwichId)),
      makeProduct({}, new UniqueEntityId(request.drinkId)),
      makeProduct({}, new UniqueEntityId(request.sideId)),
      makeProduct({}, new UniqueEntityId(request.dessertId)),
    ]);

    const result = await sut.createCombo(request);

    const expectedRepositoryComboToBeCreated = new Combo(
      {
        name: request.name,
        description: request.description,
        createdAt: result.combo.createdAt,
        price: productsArray.reduce(
          (total, product) => total + product.price,
          0
        ),
        products: new ComboProductList(
          productsArray.map(
            (product) =>
              new ComboProduct(
                {
                  comboId: new UniqueEntityId(result.combo.id.toString()),
                  productId: product.id,
                },
                new UniqueEntityId()
              )
          )
        ),
      },
      new UniqueEntityId(result.combo.id.toString())
    );

    expect(comboRepository.create).toHaveBeenCalledWith(
      expectedRepositoryComboToBeCreated
    );

    expect(result.combo).toEqual(expectedRepositoryComboToBeCreated);
  });

  it("should throw 'MinimumResourcesNotReached' if no products are provided", async () => {
    const request: CreateComboUseCaseRequestDTO = {
      description: faker.lorem.sentence(),
      name: undefined,
      dessertId: undefined,
      drinkId: undefined,
      sandwichId: undefined,
      sideId: undefined,
    };

    await expect(sut.createCombo(request)).rejects.toThrow(
      MinimumResourcesNotReached
    );
  });

  it("should throw 'ResourceNotFoundError' if no products are provided", async () => {
    vi.mocked(productRepository.findByIdAndCategory).mockResolvedValueOnce(
      null
    );

    const request: CreateComboUseCaseRequestDTO = {
      description: faker.lorem.sentence(),
      name: faker.lorem.word(),
      dessertId: faker.string.uuid(),
      drinkId: faker.string.uuid(),
      sandwichId: faker.string.uuid(),
      sideId: faker.string.uuid(),
    };

    await expect(sut.createCombo(request)).rejects.toThrow(
      ResourceNotFoundError
    );
  });

  it("should throw 'EntityNotActiveError' when informed product is not active", async () => {
    const inactiveProduct = makeProduct({
      active: false,
    });
    vi.mocked(productRepository.findByIdAndCategory).mockResolvedValueOnce(
      inactiveProduct
    );

    const request: CreateComboUseCaseRequestDTO = {
      description: faker.lorem.sentence(),
      name: faker.lorem.word(),
      dessertId: faker.string.uuid(),
      drinkId: faker.string.uuid(),
      sandwichId: faker.string.uuid(),
      sideId: faker.string.uuid(),
    };

    await expect(sut.createCombo(request)).rejects.toThrow(
      EntityNotActiveError
    );
  });
});
