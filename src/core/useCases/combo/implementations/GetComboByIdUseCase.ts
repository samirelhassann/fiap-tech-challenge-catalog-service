import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { IComboRepository } from "@/core/interfaces/repositories/IComboRepository";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  GetComboByIdUseCaseRequestDTO,
  GetComboByIdUseCaseResponseDTO,
} from "../dto/GetComboByIdUseCaseDTO";

export class GetComboByIdUseCase {
  constructor(
    private comboRepository: IComboRepository,
    private productRepository: IProductRepository
  ) {}

  async execute({
    id,
  }: GetComboByIdUseCaseRequestDTO): Promise<GetComboByIdUseCaseResponseDTO> {
    const combo = await this.comboRepository.findById(id);

    if (!combo) {
      throw new ResourceNotFoundError("combo");
    }

    const productIds = combo.products
      .getItems()
      .map((p) => p.productId.toString());

    const productDetails =
      await this.productRepository.findManyByIds(productIds);

    return { combo, productDetails };
  }
}
