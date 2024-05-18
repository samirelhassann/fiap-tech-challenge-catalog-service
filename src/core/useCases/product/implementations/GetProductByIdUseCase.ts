import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  GetProductByIdUseCaseRequestDTO,
  GetProductByIdUseCaseResponseDTO,
} from "../dto/GetProductByIdUseCaseDTO";

export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({
    id,
  }: GetProductByIdUseCaseRequestDTO): Promise<GetProductByIdUseCaseResponseDTO> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ResourceNotFoundError("product");
    }

    return { product };
  }
}
