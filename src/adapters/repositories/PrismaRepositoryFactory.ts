import { PrismaComboProductRepository } from "./PrismaComboProductRepository";
import { PrismaComboRepository } from "./PrismaComboRepository";
import { PrismaProductRepository } from "./PrismaProductRepository";

let comboProductRepositoryInstance: PrismaComboProductRepository;
let comboRepositoryInstance: PrismaComboRepository;
let productRepositoryInstance: PrismaProductRepository;

export function makeComboProductRepository() {
  if (!comboProductRepositoryInstance) {
    comboProductRepositoryInstance = new PrismaComboProductRepository();
  }
  return comboProductRepositoryInstance;
}

export function makeComboRepository() {
  if (!comboRepositoryInstance) {
    comboRepositoryInstance = new PrismaComboRepository(
      makeComboProductRepository()
    );
  }
  return comboRepositoryInstance;
}

export function makeProductRepository() {
  if (!productRepositoryInstance) {
    productRepositoryInstance = new PrismaProductRepository();
  }
  return productRepositoryInstance;
}
