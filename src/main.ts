import {
  atualizarProduto,
  buscarProdutoPorId,
  buscarProdutosPorNome,
  cadastrarProduto,
  filtrarProdutosPorCategoria,
  listarProdutos,
  removerProduto,
} from "./produtos";
import { clientes } from "./clientes";

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

console.log("Mini E-commerce");
console.log(`Clientes cadastrados: ${clientes.length}`);

// ---------- Sprint 2: produtos ----------
titulo("Catálogo inicial");
console.table(listarProdutos());

titulo("Cadastro de produto");
const novo = cadastrarProduto({
  id: 6,
  nome: "  Cadeira Ergonômica ",
  categoria: "Móveis",
  preco: 1200,
  estoque: 5,
});
console.log("Cadastrado:", novo);

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

titulo("Situações inválidas");
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