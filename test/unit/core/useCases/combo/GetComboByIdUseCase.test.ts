import { describe, it, beforeEach, vi, expect } from "vitest";

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { IComboRepository } from "@/core/interfaces/repositories/IComboRepository";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";
import { ComboUseCase } from "@/core/useCases/combo/ComboUseCase";
import { GetComboByIdUseCaseRequestDTO } from "@/core/useCases/combo/dto/GetComboByIdUseCaseDTO";
import { IComboUseCase } from "@/core/useCases/combo/IComboUseCase";
import { faker } from "@faker-js/faker";
import { makeCombo } from "@test/unit/adapters/factories/MakeCombo";
import { makeProduct } from "@test/unit/adapters/factories/MakeProduct";

let comboRepository: IComboRepository;
let productRepository: IProductRepository;
let sut: IComboUseCase;

describe("GetUsersUseCase", () => {
  beforeEach(() => {
    comboRepository = {
      findById: vi.fn(),
    } as unknown as IComboRepository;

    productRepository = {
      findManyByIds: vi.fn(),
    } as unknown as IProductRepository;

    sut = new ComboUseCase(comboRepository, productRepository);
  });

  it("should return the combo correctly", async () => {
    const comboId = faker.string.uuid();

    const request: GetComboByIdUseCaseRequestDTO = {
      id: comboId,
    };

    const combo = makeCombo({}, new UniqueEntityId(comboId));
    const productDetails = [makeProduct(), makeProduct()];

    vi.mocked(comboRepository.findById).mockResolvedValueOnce(combo);
    vi.mocked(productRepository.findManyByIds).mockResolvedValueOnce(
      productDetails
    );

    const response = await sut.getComboById(request);

    expect(response).toEqual({
      combo,
      productDetails,
    });
  });

  it("should throw an error when the informed id does not exist", async () => {
    const comboId = faker.string.uuid();

    const request: GetComboByIdUseCaseRequestDTO = {
      id: comboId,
    };

    vi.mocked(comboRepository.findById).mockResolvedValueOnce(null);

    await expect(sut.getComboById(request)).rejects.toThrow(
      ResourceNotFoundError
    );
  });
});
