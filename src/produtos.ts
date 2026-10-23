import { Produto } from "./types";

// Dados iniciais do catálogo (armazenados em memória durante a execução).
export const produtos: Produto[] = [
  { id: 1, nome: "Teclado Mecânico", categoria: "Periféricos", preco: 250.0, estoque: 15 },
  { id: 2, nome: "Mouse Sem Fio", categoria: "Periféricos", preco: 90.0, estoque: 30 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "Monitores", preco: 899.9, estoque: 8 },
  { id: 4, nome: "Webcam Full HD", categoria: "Acessórios", preco: 180.5, estoque: 12 },
  { id: 5, nome: "Headset Gamer", categoria: "Áudio", preco: 220.0, estoque: 10 },
];
