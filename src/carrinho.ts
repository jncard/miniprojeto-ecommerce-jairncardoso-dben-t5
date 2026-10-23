import { buscarClientePorId } from "./clientes";
import { buscarProdutoPorId } from "./produtos";
import { Carrinho, ItemCarrinho, LinhaCarrinho, Produto } from "./types";

// Carrinhos em memória, um por cliente.
const carrinhos: Carrinho[] = [];

// Arredonda para 2 casas decimais. Evita erros de ponto flutuante,
// como 899.9 * 3 resultar em 2699.7000000000003.
function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function validarQuantidade(quantidade: number): void {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error("A quantidade deve ser um número inteiro maior que zero.");
  }
}

function obterProduto(produtoId: number): Produto {
  const produto = buscarProdutoPorId(produtoId);
  if (produto === undefined) {
    throw new Error(`Produto com id ${produtoId} não encontrado.`);
  }
  return produto;
}

function validarEstoque(produto: Produto, quantidade: number): void {
  if (quantidade > produto.estoque) {
    throw new Error(
      `Estoque insuficiente para "${produto.nome}": solicitado ${quantidade}, disponível ${produto.estoque}.`
    );
  }
}

// Retorna o carrinho do cliente, criando um vazio se ainda não existir.
export function obterCarrinho(clienteId: number): Carrinho {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} não encontrado.`);
  }
  let carrinho = carrinhos.find((c) => c.clienteId === clienteId);
  if (carrinho === undefined) {
    carrinho = { clienteId, itens: [] };
    carrinhos.push(carrinho);
  }
  return carrinho;
}

// Se o produto já está no carrinho, soma a quantidade na mesma linha (sem duplicar).
export function adicionarAoCarrinho(
  clienteId: number,
  produtoId: number,
  quantidade: number
): ItemCarrinho {
  validarQuantidade(quantidade);
  const carrinho = obterCarrinho(clienteId);
  const produto = obterProduto(produtoId);

  const item = carrinho.itens.find((i) => i.produtoId === produtoId);
  const quantidadeFinal = (item?.quantidade ?? 0) + quantidade;
  // O estoque é conferido considerando o que o cliente já tem no carrinho.
  validarEstoque(produto, quantidadeFinal);

  if (item !== undefined) {
    item.quantidade = quantidadeFinal;
    return item;
  }
  const novoItem: ItemCarrinho = { produtoId, quantidade };
  carrinho.itens.push(novoItem);
  return novoItem;
}

// Define a nova quantidade de um item que já está no carrinho.
// Para tirar o item, use removerDoCarrinho.
export function alterarQuantidade(
  clienteId: number,
  produtoId: number,
  novaQuantidade: number
): ItemCarrinho {
  validarQuantidade(novaQuantidade);
  const carrinho = obterCarrinho(clienteId);

  const item = carrinho.itens.find((i) => i.produtoId === produtoId);
  if (item === undefined) {
    throw new Error(`O produto ${produtoId} não está no carrinho do cliente ${clienteId}.`);
  }
  validarEstoque(obterProduto(produtoId), novaQuantidade);

  item.quantidade = novaQuantidade;
  return item;
}

export function removerDoCarrinho(clienteId: number, produtoId: number): ItemCarrinho {
  const carrinho = obterCarrinho(clienteId);
  const indice = carrinho.itens.findIndex((i) => i.produtoId === produtoId);
  if (indice === -1) {
    throw new Error(`O produto ${produtoId} não está no carrinho do cliente ${clienteId}.`);
  }
  const [removido] = carrinho.itens.splice(indice, 1);
  return removido;
}

// Subtotal = preço unitário x quantidade.
export function calcularSubtotal(precoUnitario: number, quantidade: number): number {
  return arredondar(precoUnitario * quantidade);
}

export function listarItensCarrinho(clienteId: number): LinhaCarrinho[] {
  return obterCarrinho(clienteId).itens.map((item) => {
    const produto = obterProduto(item.produtoId);
    return {
      produtoId: item.produtoId,
      nome: produto.nome,
      precoUnitario: produto.preco,
      quantidade: item.quantidade,
      subtotal: calcularSubtotal(produto.preco, item.quantidade),
    };
  });
}

// Total = soma dos subtotais.
export function calcularTotal(clienteId: number): number {
  const total = listarItensCarrinho(clienteId).reduce((soma, linha) => soma + linha.subtotal, 0);
  return arredondar(total);
}
