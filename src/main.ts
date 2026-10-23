import {
  atualizarProduto,
  buscarProdutoPorId,
  buscarProdutosPorNome,
  cadastrarProduto,
  filtrarProdutosPorCategoria,
  listarProdutos,
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

// ---------- Utilitários de apresentação e verificação ----------

let verificacoesOk = 0;
let verificacoesFalhas = 0;
let invalidosTestados = 0;
let invalidosTratados = 0;

function titulo(texto: string): void {
  console.log(`\n=== ${texto} ===`);
}

function moeda(valor: number): string {
  return `R$ ${valor.toFixed(2)}`;
}

// Confere um resultado esperado e registra se deu certo.
function verificar(descricao: string, condicao: boolean): void {
  if (condicao) {
    verificacoesOk += 1;
    console.log(`  [OK] ${descricao}`);
  } else {
    verificacoesFalhas += 1;
    console.log(`  [FALHA] ${descricao}`);
  }
}

// Executa uma ação que DEVE falhar e mostra a mensagem do erro.
function testarInvalido(descricao: string, acao: () => void): void {
  invalidosTestados += 1;
  try {
    acao();
    console.log(`  [FALHA] "${descricao}" deveria ter gerado erro.`);
  } catch (erro) {
    invalidosTratados += 1;
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.log(`  [Erro esperado] ${descricao}: ${mensagem}`);
  }
}

function estoqueDe(produtoId: number): number {
  return buscarProdutoPorId(produtoId)?.estoque ?? -1;
}

function mostrarCarrinho(clienteId: number): void {
  console.table(listarItensCarrinho(clienteId));
  console.log(`Total do carrinho do cliente ${clienteId}: ${moeda(calcularTotal(clienteId))}`);
}

function mostrarPedido(pedido: Pedido): void {
  console.log(`Pedido #${pedido.id} | cliente ${pedido.clienteId} | ${pedido.data.toLocaleString("pt-BR")}`);
  console.table(pedido.itens);
  console.log(`Total do pedido: ${moeda(pedido.total)}`);
}

function resumirPedidos(lista: Pedido[]): object[] {
  return lista.map((p) => ({ id: p.id, clienteId: p.clienteId, itens: p.itens.length, total: p.total }));
}

// ---------- Etapas da demonstração ----------

function apresentarDadosIniciais(): void {
  titulo("1. Dados iniciais");
  console.log("Catálogo:");
  console.table(listarProdutos());
  console.log("Clientes:");
  console.table(listarClientes());
}

function gerenciarProdutosEClientes(): void {
  titulo("2. Gerenciamento de produtos");
  cadastrarProduto({ id: 6, nome: "  Cadeira Ergonômica ", categoria: "Móveis", preco: 1200, estoque: 5 });
  cadastrarProduto({ id: 7, nome: "Produto Temporário", categoria: "Teste", preco: 10, estoque: 1 });
  verificar("catálogo com 7 produtos após dois cadastros", listarProdutos().length === 7);

  console.log(`Busca por id (produto 3): ${buscarProdutoPorId(3)?.nome}`);
  console.log("Busca por parte do nome ('mo'):");
  console.table(buscarProdutosPorNome("mo"));
  verificar("busca por 'mo' encontra 2 produtos", buscarProdutosPorNome("mo").length === 2);

  console.log("Filtro por categoria ('periféricos'):");
  console.table(filtrarProdutosPorCategoria("periféricos"));
  verificar("categoria 'periféricos' tem 2 produtos", filtrarProdutosPorCategoria("periféricos").length === 2);

  atualizarProduto(7, { preco: 15, estoque: 3 });
  verificar("produto 7 atualizado para R$ 15,00 e 3 unidades",
    buscarProdutoPorId(7)?.preco === 15 && estoqueDe(7) === 3);

  removerProdutoDoCatalogo(7); // não está em nenhum pedido, então pode ser removido
  verificar("produto 7 removido (catálogo volta a 6 produtos)", listarProdutos().length === 6);

  titulo("3. Gerenciamento de clientes");
  cadastrarCliente({ id: 4, nome: " Daniel Rocha ", email: "daniel.rocha@email.com" });
  console.table(listarClientes());
  verificar("4 clientes cadastrados", listarClientes().length === 4);
  console.log(`Busca de cliente por id (2): ${buscarClientePorId(2)?.nome}`);
}

function fluxoCompraDoCliente1(): void {
  const estoqueTecladoAntes = estoqueDe(1);
  const estoqueMouseAntes = estoqueDe(2);

  titulo("4. Compra do cliente 1: montando o carrinho");
  console.log("Adiciona 2 teclados (produto 1) e 1 monitor (produto 3)");
  adicionarAoCarrinho(1, 1, 2);
  adicionarAoCarrinho(1, 3, 1);
  console.log("Adiciona mais 1 teclado: a quantidade soma na mesma linha");
  adicionarAoCarrinho(1, 1, 1);
  verificar("carrinho com 2 linhas (teclado não foi duplicado)", listarItensCarrinho(1).length === 2);

  console.log("Altera o monitor para 2 unidades");
  alterarQuantidade(1, 3, 2);
  mostrarCarrinho(1);
  verificar("total = 3 x 250,00 + 2 x 899,90 = 2549,80", calcularTotal(1) === 2549.8);

  console.log("Remove o monitor e adiciona 4 mouses");
  removerDoCarrinho(1, 3);
  adicionarAoCarrinho(1, 2, 4);
  mostrarCarrinho(1);
  verificar("total = 3 x 250,00 + 4 x 90,00 = 1110,00", calcularTotal(1) === 1110);

  titulo("5. Compra do cliente 1: finalizando o pedido");
  const pedido = finalizarPedido(1);
  mostrarPedido(pedido);
  verificar("total do pedido = 1110,00", pedido.total === 1110);
  verificar(`estoque do teclado: ${estoqueTecladoAntes} -> ${estoqueDe(1)}`, estoqueDe(1) === estoqueTecladoAntes - 3);
  verificar(`estoque do mouse: ${estoqueMouseAntes} -> ${estoqueDe(2)}`, estoqueDe(2) === estoqueMouseAntes - 4);
  verificar("carrinho do cliente 1 ficou vazio", listarItensCarrinho(1).length === 0);

  titulo("6. O pedido guarda o preço praticado na compra");
  atualizarProduto(1, { preco: 300 });
  verificar("catálogo agora cobra R$ 300,00 pelo teclado", buscarProdutoPorId(1)?.preco === 300);
  verificar("pedido #1 continua com R$ 250,00 pelo teclado",
    pedido.itens.find((item) => item.produtoId === 1)?.precoUnitario === 250);
}

function outrasComprasEConsultas(): void {
  titulo("7. Compras dos clientes 2 e 4");
  adicionarAoCarrinho(2, 3, 3);
  const pedido2 = finalizarPedido(2);
  mostrarPedido(pedido2);
  verificar("total = 3 x 899,90 = 2699,70", pedido2.total === 2699.7);
  verificar("estoque do monitor: 8 -> 5", estoqueDe(3) === 5);

  adicionarAoCarrinho(4, 6, 1);
  mostrarPedido(finalizarPedido(4));
  verificar("estoque da cadeira: 5 -> 4", estoqueDe(6) === 4);

  titulo("8. Consulta de pedidos");
  console.log("Todos os pedidos:");
  console.table(resumirPedidos(listarPedidos()));
  verificar("3 pedidos registrados", listarPedidos().length === 3);
  console.log("Pedidos do cliente 1:");
  console.table(resumirPedidos(listarPedidosPorCliente(1)));
  verificar("cliente 1 tem exatamente 1 pedido", listarPedidosPorCliente(1).length === 1);
}

function testarSituacoesInvalidas(): void {
  titulo("9. Situações inválidas");

  console.log("Produtos:");
  testarInvalido("preço negativo", () =>
    cadastrarProduto({ id: 20, nome: "Produto X", categoria: "Teste", preco: -10, estoque: 1 })
  );
  testarInvalido("nome vazio", () =>
    cadastrarProduto({ id: 20, nome: "   ", categoria: "Teste", preco: 10, estoque: 1 })
  );
  testarInvalido("estoque negativo", () =>
    cadastrarProduto({ id: 20, nome: "Produto X", categoria: "Teste", preco: 10, estoque: -1 })
  );
  testarInvalido("id repetido", () =>
    cadastrarProduto({ id: 1, nome: "Duplicado", categoria: "Teste", preco: 10, estoque: 1 })
  );
  testarInvalido("remover produto inexistente", () => removerProdutoDoCatalogo(99));
  testarInvalido("remover produto que já está em um pedido", () => removerProdutoDoCatalogo(1));

  console.log("Clientes:");
  testarInvalido("e-mail repetido", () =>
    cadastrarCliente({ id: 20, nome: "Outro", email: "ANA.SOUZA@email.com" })
  );
  testarInvalido("nome vazio", () => cadastrarCliente({ id: 20, nome: "  ", email: "x@email.com" }));

  console.log("Carrinho:");
  testarInvalido("quantidade zero", () => adicionarAoCarrinho(3, 2, 0));
  testarInvalido("produto inexistente", () => adicionarAoCarrinho(3, 99, 1));
  testarInvalido("quantidade acima do estoque", () => adicionarAoCarrinho(3, 4, 100));

  console.log("Pedidos:");
  testarInvalido("finalizar pedido sem itens", () => finalizarPedido(3));
  testarInvalido("finalizar pedido de cliente inexistente", () => finalizarPedido(99));

  titulo("10. Finalização atômica: um item sem estoque cancela a compra inteira");
  adicionarAoCarrinho(3, 4, 10); // 10 webcams (estoque 12)
  adicionarAoCarrinho(3, 5, 5); // 5 headsets (estoque 10)
  atualizarProduto(5, { estoque: 2 }); // simula outra venda que consumiu o estoque
  const pedidosAntes = listarPedidos().length;
  const estoqueWebcamAntes = estoqueDe(4);
  testarInvalido("pedido com item sem estoque suficiente", () => finalizarPedido(3));
  verificar("estoque da webcam não foi alterado", estoqueDe(4) === estoqueWebcamAntes);
  verificar("nenhum pedido foi registrado", listarPedidos().length === pedidosAntes);
  verificar("carrinho do cliente 3 continua com 2 itens", listarItensCarrinho(3).length === 2);
}

function mostrarResumo(): void {
  titulo("Resumo da execução");
  console.log(`Verificações de resultado: ${verificacoesOk} OK, ${verificacoesFalhas} falhas`);
  console.log(`Situações inválidas tratadas: ${invalidosTratados} de ${invalidosTestados}`);
}

// ---------- Execução ----------

console.log("Mini E-commerce");
apresentarDadosIniciais();
gerenciarProdutosEClientes();
fluxoCompraDoCliente1();
outrasComprasEConsultas();
testarSituacoesInvalidas();
mostrarResumo();