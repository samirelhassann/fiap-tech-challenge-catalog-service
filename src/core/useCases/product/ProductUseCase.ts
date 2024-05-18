import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  CreateProductUseCaseRequestDTO,
  CreateProductUseCaseResponseDTO,
} from "./dto/CreateProductUseCaseDTO";
import {
  EditProductUseCaseRequestDTO,
  EditProductUseCaseResponseDTO,
} from "./dto/EditProductUseCaseDTO";
import {
  GetProductByIdUseCaseRequestDTO,
  GetProductByIdUseCaseResponseDTO,
} from "./dto/GetProductByIdUseCaseDTO";
import {
  GetProductsUseCaseRequestDTO,
  GetProductsUseCaseResponseDTO,
} from "./dto/GetProductsUseCaseDTO";
import {
  InactiveProductUseCaseRequestDTO,
  InactiveProductUseCaseResponseDTO,
} from "./dto/InactiveProductUseCaseDTO";
import { CreateProductUseCase } from "./implementations/CreateProductUseCase";
import { EditProductUseCase } from "./implementations/EditProductUseCase";
import { GetProductByIdUseCase } from "./implementations/GetProductByIdUseCase";
import { GetProductsUseCase } from "./implementations/GetProductsUseCase";
import { InactivateProductUseCase } from "./implementations/InactivateProductUseCase";
import { IProductUseCase } from "./IProductUseCase";

export class ProductUseCase implements IProductUseCase {
  private getProductsUseCase: GetProductsUseCase;

  private getProductByIdUseCase: GetProductByIdUseCase;

  private createProductUseCase: CreateProductUseCase;

  private editProductUseCase: EditProductUseCase;

  private inactivateProductUseCase: InactivateProductUseCase;

  constructor(private productRepository: IProductRepository) {
    this.getProductsUseCase = new GetProductsUseCase(productRepository);
    this.getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    this.createProductUseCase = new CreateProductUseCase(productRepository);
    this.editProductUseCase = new EditProductUseCase(productRepository);
    this.inactivateProductUseCase = new InactivateProductUseCase(
      productRepository
    );
  }

  async getProducts(
    props: GetProductsUseCaseRequestDTO
  ): Promise<GetProductsUseCaseResponseDTO> {
    return this.getProductsUseCase.execute(props);
  }

  async getProductById(
    props: GetProductByIdUseCaseRequestDTO
  ): Promise<GetProductByIdUseCaseResponseDTO> {
    return this.getProductByIdUseCase.execute(props);
  }

  async createProduct(
    props: CreateProductUseCaseRequestDTO
  ): Promise<CreateProductUseCaseResponseDTO> {
    return this.createProductUseCase.execute(props);
  }

  async editProduct(
    props: EditProductUseCaseRequestDTO
  ): Promise<EditProductUseCaseResponseDTO> {
    return this.editProductUseCase.execute(props);
  }

  async inactiveProduct(
    props: InactiveProductUseCaseRequestDTO
  ): Promise<InactiveProductUseCaseResponseDTO> {
    return this.inactivateProductUseCase.execute(props);
  }
}
