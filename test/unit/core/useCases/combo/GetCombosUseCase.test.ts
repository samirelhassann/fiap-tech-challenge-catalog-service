import { describe, it, beforeEach, vi, expect } from "vitest";

import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Combo } from "@/core/domain/entities/Combo";
import { IComboRepository } from "@/core/interfaces/repositories/IComboRepository";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";
import { ComboUseCase } from "@/core/useCases/combo/ComboUseCase";
import { GetCombosUseCaseRequestDTO } from "@/core/useCases/combo/dto/GetCombosUseCaseDTO";
import { IComboUseCase } from "@/core/useCases/combo/IComboUseCase";
import { makeCombo } from "@test/unit/adapters/factories/MakeCombo";

let comboRepository: IComboRepository;
let productRepository: IProductRepository;
let sut: IComboUseCase;

describe("GetCombosUseCase", () => {
  beforeEach(() => {
    comboRepository = {
      findMany: vi.fn(),
    } as unknown as IComboRepository;

    productRepository = {} as unknown as IProductRepository;

    sut = new ComboUseCase(comboRepository, productRepository);
  });

  it("should return the combos correctly", async () => {
    const request: GetCombosUseCaseRequestDTO = {
      params: new PaginationParams(1, 10),
    };

    const combos = [makeCombo(), makeCombo()];

    const paginationResponse = new PaginationResponse<Combo>({
      data: combos,
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      pageSize: request.params.size,
    });

    vi.mocked(comboRepository.findMany).mockResolvedValueOnce(
      paginationResponse
    );

    const response = await sut.getCombos(request);

    expect(response).toEqual({ paginationResponse });
  });

  it("should return the combos from the second pagination correctly", async () => {
    const request: GetCombosUseCaseRequestDTO = {
      params: new PaginationParams(2, 10),
    };

    const combos = [makeCombo(), makeCombo()];

    const paginationResponse = new PaginationResponse<Combo>({
      data: combos,
      currentPage: 2,
      totalPages: 1,
      totalItems: 2,
      pageSize: request.params.size,
    });

    vi.mocked(comboRepository.findMany).mockResolvedValueOnce(
      paginationResponse
    );

    const response = await sut.getCombos(request);

    expect(response).toEqual({ paginationResponse });
  });
});
