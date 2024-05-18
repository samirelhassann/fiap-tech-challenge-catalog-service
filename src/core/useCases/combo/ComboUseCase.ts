/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { IComboRepository } from "@/core/interfaces/repositories/IComboRepository";
import { IProductRepository } from "@/core/interfaces/repositories/IProductRepository";

import {
  CreateComboUseCaseRequestDTO,
  CreateComboUseCaseResponseDTO,
} from "./dto/CreateComboUseCaseDTO";
import {
  GetComboByIdUseCaseRequestDTO,
  GetComboByIdUseCaseResponseDTO,
} from "./dto/GetComboByIdUseCaseDTO";
import {
  GetCombosUseCaseRequestDTO,
  GetCombosUseCaseResponseDTO,
} from "./dto/GetCombosUseCaseDTO";
import { IComboUseCase } from "./IComboUseCase";
import { CreateComboUseCase } from "./implementations/CreateComboUseCase";
import { GetComboByIdUseCase } from "./implementations/GetComboByIdUseCase";
import { GetCombosUseCase } from "./implementations/GetCombosUseCase";

export class ComboUseCase implements IComboUseCase {
  private getCombosUseCase: GetCombosUseCase;

  private getComboByIdUseCase: GetComboByIdUseCase;

  private createComboUseCase: CreateComboUseCase;

  constructor(
    private comboRepository: IComboRepository,
    private productRepository: IProductRepository
  ) {
    this.getCombosUseCase = new GetCombosUseCase(this.comboRepository);
    this.getComboByIdUseCase = new GetComboByIdUseCase(
      this.comboRepository,
      this.productRepository
    );
    this.createComboUseCase = new CreateComboUseCase(
      this.comboRepository,
      this.productRepository
    );
  }

  async getCombos(
    props: GetCombosUseCaseRequestDTO
  ): Promise<GetCombosUseCaseResponseDTO> {
    return this.getCombosUseCase.execute(props);
  }

  async getComboById(
    props: GetComboByIdUseCaseRequestDTO
  ): Promise<GetComboByIdUseCaseResponseDTO> {
    return this.getComboByIdUseCase.execute(props);
  }

  async createCombo(
    props: CreateComboUseCaseRequestDTO
  ): Promise<CreateComboUseCaseResponseDTO> {
    return this.createComboUseCase.execute(props);
  }
}
