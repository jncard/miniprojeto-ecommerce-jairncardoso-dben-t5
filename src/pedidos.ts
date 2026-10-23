import { arredondar, calcularSubtotal, limparCarrinho, obterCarrinho } from "./carrinho";
import { buscarClientePorId } from "./clientes";
import { atualizarProduto, buscarProdutoPorId, removerProduto } from "./produtos";
import { ItemPedido, Pedido, Produto } from "./types";

// Pedidos registrados em memória.
const pedidos: Pedido[] = [];
let proximoId = 1; // contador que garante um id único para cada pedido

// Transforma o carrinho do cliente em um pedido registrado.
// A operação é "tudo ou nada": primeiro valida TODOS os itens e só depois altera o estoque.
export function finalizarPedido(clienteId: number): Pedido {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} não encontrado.`);
  }

  const carrinho = obterCarrinho(clienteId);
  if (carrinho.itens.length === 0) {
    throw new Error("Não é possível finalizar um pedido sem itens.");
  }

  // Etapa 1: validar cada item sem alterar nada. Se algo falhar, o erro interrompe aqui.
  const linhas: { produto: Produto; quantidade: number }[] = carrinho.itens.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto === undefined) {
      throw new Error(`Produto com id ${item.produtoId} não existe mais no catálogo.`);
    }
    if (item.quantidade > produto.estoque) {
      throw new Error(
        `Estoque insuficiente para "${produto.nome}": solicitado ${item.quantidade}, disponível ${produto.estoque}.`
      );
    }
    return { produto, quantidade: item.quantidade };
  });

  // O pedido guarda o preço praticado agora, para que mudanças futuras no catálogo não o alterem.
  const itens: ItemPedido[] = linhas.map(({ produto, quantidade }) => ({
    produtoId: produto.id,
    nome: produto.nome,
    quantidade,
    precoUnitario: produto.preco,
  }));

  const total = arredondar(
    itens.reduce((soma, item) => soma + calcularSubtotal(item.precoUnitario, item.quantidade), 0)
  );

  // Etapa 2: tudo validado, então é seguro baixar o estoque e registrar o pedido.
  linhas.forEach(({ produto, quantidade }) => {
    atualizarProduto(produto.id, { estoque: produto.estoque - quantidade });
  });

  const pedido: Pedido = { id: proximoId, clienteId, itens, total, data: new Date() };
  proximoId += 1;
  pedidos.push(pedido);

  limparCarrinho(clienteId);
  return pedido;
}

// Retorna uma cópia do array, para não expor a lista original.
export function listarPedidos(): Pedido[] {
  return [...pedidos];
}

export function listarPedidosPorCliente(clienteId: number): Pedido[] {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} não encontrado.`);
  }
  return pedidos.filter((pedido) => pedido.clienteId === clienteId);
}

export function produtoPossuiPedidos(produtoId: number): boolean {
  return pedidos.some((pedido) => pedido.itens.some((item) => item.produtoId === produtoId));
}

// Remove um produto do catálogo respeitando a regra do sistema:
// produtos que já fazem parte de algum pedido não podem ser removidos, para preservar o histórico.
// Esta regra fica aqui (e não em produtos.ts) para evitar que os dois módulos se importem mutuamente.
export function removerProdutoDoCatalogo(produtoId: number): Produto {
  if (produtoPossuiPedidos(produtoId)) {
    throw new Error(`O produto ${produtoId} não pode ser removido porque já faz parte de pedidos.`);
  }
  return removerProduto(produtoId);
}