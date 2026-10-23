import { Produto } from "./types";

// Dados do produto sem o id (usado em validações e atualizações).
type DadosProduto = Omit<Produto, "id">;

// Catálogo em memória, com dados iniciais.
export const produtos: Produto[] = [
  { id: 1, nome: "Teclado Mecânico", categoria: "Periféricos", preco: 250.0, estoque: 15 },
  { id: 2, nome: "Mouse Sem Fio", categoria: "Periféricos", preco: 90.0, estoque: 30 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "Monitores", preco: 899.9, estoque: 8 },
  { id: 4, nome: "Webcam Full HD", categoria: "Acessórios", preco: 180.5, estoque: 12 },
  { id: 5, nome: "Headset Gamer", categoria: "Áudio", preco: 220.0, estoque: 10 },
];

// Regras de negócio comuns ao cadastro e à atualização.
// Lança um erro com mensagem clara quando algum dado é inválido.
function validarDados(dados: DadosProduto): void {
  if (dados.nome.trim() === "") {
    throw new Error("O nome do produto não pode estar vazio.");
  }
  if (!Number.isFinite(dados.preco) || dados.preco <= 0) {
    throw new Error("O preço deve ser maior que zero.");
  }
  // O estoque conta unidades, por isso deve ser inteiro e nunca negativo.
  if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
    throw new Error("O estoque deve ser um número inteiro maior ou igual a zero.");
  }
}

export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((produto) => produto.id === id);
}

export function cadastrarProduto(produto: Produto): Produto {
  if (buscarProdutoPorId(produto.id) !== undefined) {
    throw new Error(`Já existe um produto com o id ${produto.id}.`);
  }
  validarDados(produto);

  const novoProduto: Produto = { ...produto, nome: produto.nome.trim() };
  produtos.push(novoProduto);
  return novoProduto;
}

// Retorna uma cópia do array, para que quem chamar não altere o catálogo sem querer.
export function listarProdutos(): Produto[] {
  return [...produtos];
}

// Busca por parte do nome, sem diferenciar maiúsculas de minúsculas.
export function buscarProdutosPorNome(trecho: string): Produto[] {
  const termo = trecho.trim().toLowerCase();
  return produtos.filter((produto) => produto.nome.toLowerCase().includes(termo));
}

export function filtrarProdutosPorCategoria(categoria: string): Produto[] {
  const alvo = categoria.trim().toLowerCase();
  return produtos.filter((produto) => produto.categoria.toLowerCase() === alvo);
}

// Atualiza somente os campos informados. O id nunca pode ser alterado.
export function atualizarProduto(id: number, dados: Partial<DadosProduto>): Produto {
  const produto = buscarProdutoPorId(id);
  if (produto === undefined) {
    throw new Error(`Produto com id ${id} não encontrado.`);
  }

  // Monta o resultado e valida antes de alterar, para não deixar o produto pela metade.
  const atualizado: DadosProduto = {
    nome: dados.nome ?? produto.nome,
    categoria: dados.categoria ?? produto.categoria,
    preco: dados.preco ?? produto.preco,
    estoque: dados.estoque ?? produto.estoque,
  };
  validarDados(atualizado);

  produto.nome = atualizado.nome.trim();
  produto.categoria = atualizado.categoria;
  produto.preco = atualizado.preco;
  produto.estoque = atualizado.estoque;
  return produto;
}

export function removerProduto(id: number): Produto {
  const indice = produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) {
    throw new Error(`Produto com id ${id} não encontrado.`);
  }
  const [removido] = produtos.splice(indice, 1);
  return removido;
}