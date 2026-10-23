import {
  atualizarProduto,
  buscarProdutoPorId,
  buscarProdutosPorNome,
  cadastrarProduto,
  filtrarProdutosPorCategoria,
  listarProdutos,
  removerProduto,
} from "./produtos";
import { buscarClientePorId, cadastrarCliente, listarClientes } from "./clientes";
import {
  adicionarAoCarrinho,
  alterarQuantidade,
  calcularTotal,
  listarItensCarrinho,
  removerDoCarrinho,
} from "./carrinho";
import {
  finalizarPedido,
  listarPedidos,
  listarPedidosPorCliente,
  removerProdutoDoCatalogo,
} from "./pedidos";
import { Pedido } from "./types";

function titulo(texto: string): void {
  console.log(`\n=== ${texto} ===`);
}

// Executa uma ação que DEVE falhar e mostra a mensagem do erro.
function testarInvalido(descricao: string, acao: () => void): void {
  try {
    acao();
    console.log(`FALHA: "${descricao}" deveria ter gerado erro.`);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.log(`Erro esperado (${descricao}): ${mensagem}`);
  }
}

function mostrarCarrinho(clienteId: number): void {
  console.table(listarItensCarrinho(clienteId));
  console.log(`Total do carrinho do cliente ${clienteId}: R$ ${calcularTotal(clienteId).toFixed(2)}`);
}

// ---------- Sprint 2: produtos ----------
function demonstrarProdutos(): void {
  titulo("Catálogo inicial");
  console.table(listarProdutos());

  titulo("Cadastro de produto");
  console.log("Cadastrado:", cadastrarProduto({
    id: 6,
    nome: "  Cadeira Ergonômica ",
    categoria: "Móveis",
    preco: 1200,
    estoque: 5,
  }));

  titulo("Busca por id");
  console.log("Produto 3:", buscarProdutoPorId(3));
  console.log("Produto 99:", buscarProdutoPorId(99));

  titulo("Busca por parte do nome ('mo')");
  console.table(buscarProdutosPorNome("mo"));

  titulo("Filtro por categoria ('periféricos')");
  console.table(filtrarProdutosPorCategoria("periféricos"));

  titulo("Atualização do produto 2 (preço e estoque)");
  console.log("Atualizado:", atualizarProduto(2, { preco: 79.9, estoque: 25 }));

  titulo("Remoção do produto 6");
  console.log("Removido:", removerProduto(6));
  console.log(`Total de produtos agora: ${listarProdutos().length}`);

  titulo("Produtos: situações inválidas");
  testarInvalido("preço negativo", () =>
    cadastrarProduto({ id: 7, nome: "Produto X", categoria: "Teste", preco: -10, estoque: 1 })
  );
  testarInvalido("nome vazio", () =>
    cadastrarProduto({ id: 7, nome: "   ", categoria: "Teste", preco: 10, estoque: 1 })
  );
  testarInvalido("estoque negativo", () =>
    cadastrarProduto({ id: 7, nome: "Produto X", categoria: "Teste", preco: 10, estoque: -1 })
  );
  testarInvalido("id repetido", () =>
    cadastrarProduto({ id: 1, nome: "Duplicado", categoria: "Teste", preco: 10, estoque: 1 })
  );
  testarInvalido("atualizar produto inexistente", () => atualizarProduto(99, { preco: 10 }));
  testarInvalido("atualizar com preço zero", () => atualizarProduto(1, { preco: 0 }));
  testarInvalido("remover produto inexistente", () => removerProduto(99));
}

// ---------- Sprint 3: clientes ----------
function demonstrarClientes(): void {
  titulo("Clientes iniciais");
  console.table(listarClientes());

  titulo("Cadastro de cliente");
  console.log("Cadastrado:", cadastrarCliente({
    id: 4,
    nome: " Daniel Rocha ",
    email: "daniel.rocha@email.com",
  }));

  titulo("Busca de cliente por id");
  console.log("Cliente 2:", buscarClientePorId(2));
  console.log("Cliente 99:", buscarClientePorId(99));

  titulo("Clientes: situações inválidas");
  testarInvalido("id repetido", () =>
    cadastrarCliente({ id: 1, nome: "Outro", email: "outro@email.com" })
  );
  testarInvalido("e-mail repetido", () =>
    cadastrarCliente({ id: 9, nome: "Outro", email: "ANA.SOUZA@email.com" })
  );
  testarInvalido("nome vazio", () => cadastrarCliente({ id: 9, nome: "  ", email: "x@email.com" }));
  testarInvalido("e-mail vazio", () => cadastrarCliente({ id: 9, nome: "Fulano", email: "" }));
}

// ---------- Sprint 3: carrinho ----------
function demonstrarCarrinho(): void {
  titulo("Carrinho do cliente 1: adicionando itens");
  adicionarAoCarrinho(1, 1, 2); // 2 teclados
  adicionarAoCarrinho(1, 3, 1); // 1 monitor
  mostrarCarrinho(1);

  titulo("Adicionando de novo o produto 1 (soma na mesma linha)");
  adicionarAoCarrinho(1, 1, 1);
  mostrarCarrinho(1);

  titulo("Alterando a quantidade do produto 3 para 2");
  alterarQuantidade(1, 3, 2);
  mostrarCarrinho(1);

  titulo("Removendo o produto 3 do carrinho");
  removerDoCarrinho(1, 3);
  mostrarCarrinho(1);

  titulo("Carrinho do cliente 2 (independente do cliente 1)");
  adicionarAoCarrinho(2, 3, 3); // 899.90 x 3 = 2699.70
  mostrarCarrinho(2);

  titulo("Carrinho: situações inválidas");
  testarInvalido("quantidade zero", () => adicionarAoCarrinho(1, 2, 0));
  testarInvalido("quantidade negativa", () => adicionarAoCarrinho(1, 2, -3));
  testarInvalido("quantidade fracionada", () => adicionarAoCarrinho(1, 2, 1.5));
  testarInvalido("produto inexistente", () => adicionarAoCarrinho(1, 99, 1));
  testarInvalido("quantidade acima do estoque", () => adicionarAoCarrinho(1, 4, 100));
  testarInvalido("soma acima do estoque (já há 3 do produto 1)", () => adicionarAoCarrinho(1, 1, 13));
  testarInvalido("cliente inexistente", () => adicionarAoCarrinho(99, 1, 1));
  testarInvalido("alterar item que não está no carrinho", () => alterarQuantidade(1, 5, 2));
  testarInvalido("remover item que não está no carrinho", () => removerDoCarrinho(1, 5));
}

// ---------- Sprint 4: pedidos ----------
function mostrarPedido(pedido: Pedido): void {
  console.log(`Pedido #${pedido.id} | cliente ${pedido.clienteId} | ${pedido.data.toLocaleString("pt-BR")}`);
  console.table(pedido.itens);
  console.log(`Total do pedido: R$ ${pedido.total.toFixed(2)}`);
}

function resumirPedidos(lista: Pedido[]): object[] {
  return lista.map((p) => ({ id: p.id, clienteId: p.clienteId, itens: p.itens.length, total: p.total }));
}

function demonstrarPedidos(): void {
  titulo("Finalizando o pedido do cliente 1");
  console.log(`Estoque do produto 1 antes: ${buscarProdutoPorId(1)?.estoque}`);
  const pedido1 = finalizarPedido(1);
  mostrarPedido(pedido1);
  console.log(`Estoque do produto 1 depois: ${buscarProdutoPorId(1)?.estoque}`);
  console.log(`Itens no carrinho do cliente 1 após a compra: ${listarItensCarrinho(1).length}`);

  titulo("Finalizando o pedido do cliente 2");
  mostrarPedido(finalizarPedido(2));

  titulo("O pedido guarda o preço praticado na compra");
  atualizarProduto(1, { preco: 300 });
  console.log(`Preço atual do produto 1 no catálogo: R$ ${buscarProdutoPorId(1)?.preco}`);
  console.log(`Preço do produto 1 no pedido #${pedido1.id}: R$ ${pedido1.itens[0].precoUnitario}`);

  titulo("Consulta de pedidos");
  console.log("Todos os pedidos:");
  console.table(resumirPedidos(listarPedidos()));
  console.log("Pedidos do cliente 1:");
  console.table(resumirPedidos(listarPedidosPorCliente(1)));

  titulo("Remoção de produto que não está em nenhum pedido");
  cadastrarProduto({ id: 8, nome: "Produto Temporário", categoria: "Teste", preco: 10, estoque: 1 });
  console.log("Removido:", removerProdutoDoCatalogo(8));

  titulo("Pedidos: situações inválidas");
  testarInvalido("finalizar sem itens", () => finalizarPedido(1));
  testarInvalido("cliente inexistente", () => finalizarPedido(99));
  testarInvalido("consultar pedidos de cliente inexistente", () => listarPedidosPorCliente(99));
  testarInvalido("remover produto que já está em um pedido", () => removerProdutoDoCatalogo(1));

  titulo("Finalização atômica: um item sem estoque cancela a compra inteira");
  adicionarAoCarrinho(3, 4, 10); // 10 webcams (estoque 12)
  adicionarAoCarrinho(3, 5, 5); // 5 headsets (estoque 10)
  atualizarProduto(5, { estoque: 2 }); // simula outra venda que consumiu o estoque
  const pedidosAntes = listarPedidos().length;
  testarInvalido("item sem estoque suficiente", () => finalizarPedido(3));
  console.log(`Estoque do produto 4 (deve continuar 12): ${buscarProdutoPorId(4)?.estoque}`);
  console.log(`Pedidos registrados: antes ${pedidosAntes}, depois ${listarPedidos().length}`);
  console.log(`Itens ainda no carrinho do cliente 3: ${listarItensCarrinho(3).length}`);
}

console.log("Mini E-commerce");
demonstrarProdutos();
demonstrarClientes();
demonstrarCarrinho();
demonstrarPedidos();