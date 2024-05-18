import { IComboRepository } from "@/core/interfaces/repositories/IComboRepository";

import {
  GetCombosUseCaseRequestDTO,
  GetCombosUseCaseResponseDTO,
} from "../dto/GetCombosUseCaseDTO";

export class GetCombosUseCase {
  constructor(private comboRepository: IComboRepository) {}

  async execute({
    params,
  }: GetCombosUseCaseRequestDTO): Promise<GetCombosUseCaseResponseDTO> {
    const paginationResponse = await this.comboRepository.findMany(params);

    return { paginationResponse };
  }
}
