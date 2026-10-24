# Miniprojeto de E-commerce

**Estudante:** Jair N. Cardoso
**Turma:** Desenvolvedor Back-end Node - T5

## Objetivo da aplicação

Sistema de gerenciamento de e-commerce para uma pequena loja virtual, desenvolvido em **TypeScript** e **Node.js** como mini-projeto avaliativo. A aplicação administra um catálogo de produtos, clientes, carrinhos de compras e pedidos, mantendo as informações consistentes durante a execução e evitando erros comuns, como vender produtos sem estoque, calcular valores incorretamente ou registrar pedidos incompletos.

É uma aplicação back-end executada no terminal, com os dados guardados em memória. Não há interface gráfica, banco de dados, pagamento ou autenticação.

## Funcionalidades implementadas

**Produtos**
- Cadastrar, listar, atualizar e remover produtos
- Buscar por identificador, por parte do nome e filtrar por categoria

**Clientes**
- Cadastrar e listar clientes
- Buscar cliente por identificador
- Sistema inicia com 3 clientes cadastrados

**Carrinho de compras** (um carrinho por cliente)
- Adicionar, remover e alterar a quantidade de itens
- Listar itens com subtotal de cada linha
- Calcular o valor total da compra

**Pedidos**
- Finalizar a compra de um cliente, transformando o carrinho em pedido
- Baixar o estoque dos produtos comprados
- Consultar todos os pedidos e os pedidos de um cliente específico

## Tecnologias utilizadas

- **TypeScript** 5 (modo `strict`)
- **Node.js** 18 ou superior
- **npm** para instalar o compilador
- Sem bibliotecas externas além do próprio TypeScript (dependência de desenvolvimento)

Conceitos aplicados: tipos explícitos (`type`), funções tipadas, módulos com `export`/`import`, arrays e seus métodos (`find`, `filter`, `map`, `reduce`, `some`, `findIndex`, `splice`) e tratamento de erros com `throw` e `try/catch`.

## Estrutura dos arquivos

```
miniprojeto-ecommerce-jairncardoso-dben-t5/
├── src/
│   ├── types.ts       # tipos: Produto, Cliente, ItemCarrinho, Carrinho, LinhaCarrinho, ItemPedido, Pedido
│   ├── produtos.ts    # catálogo, cadastro, consultas, atualização e remoção de produtos
│   ├── clientes.ts    # cadastro e consulta de clientes
│   ├── carrinho.ts    # operações do carrinho e cálculo de subtotais e total
│   ├── pedidos.ts     # finalização e consulta de pedidos
│   └── main.ts        # demonstração do funcionamento e verificações
├── dist/              # JavaScript gerado pela compilação (não precisa ser editado)
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Instruções de compilação e execução

**Pré-requisitos:** Node.js 18 ou superior e npm.

```bash
# 1. instalar as dependências (TypeScript)
npm install

# 2. compilar o TypeScript para JavaScript (gera a pasta dist/)
npm run build

# 3. executar a aplicação compilada com Node.js
npm start
```

Para compilar e executar de uma vez: `npm run dev`.

A execução imprime no terminal toda a demonstração: fluxo completo de compra, verificações de resultado (`[OK]`/`[FALHA]`) e situações inválidas (`[Erro esperado]`). Ao final aparece um resumo:

```
=== Resumo da execução ===
Verificações de resultado: 23 OK, 0 falhas
Situações inválidas tratadas: 14 de 14
```

## Exemplos das principais operações

```ts
// Produtos
cadastrarProduto({ id: 6, nome: "Cadeira Ergonômica", categoria: "Móveis", preco: 1200, estoque: 5 });
buscarProdutosPorNome("mo");              // Mouse Sem Fio, Monitor 24 polegadas
filtrarProdutosPorCategoria("periféricos");
atualizarProduto(2, { preco: 79.9 });

// Clientes
cadastrarCliente({ id: 4, nome: "Daniel Rocha", email: "daniel.rocha@email.com" });

// Carrinho (cliente 1)
adicionarAoCarrinho(1, 1, 2);             // 2 unidades do produto 1
adicionarAoCarrinho(1, 1, 1);             // soma na mesma linha: agora são 3
alterarQuantidade(1, 1, 4);
calcularTotal(1);                         // soma dos subtotais

// Pedidos
const pedido = finalizarPedido(1);        // registra o pedido, baixa o estoque e esvazia o carrinho
listarPedidosPorCliente(1);
```

Exemplo de pedido gerado pela demonstração (itens: 3 teclados a R$ 250,00 e 4 mouses a R$ 90,00):

```
Pedido #1 | cliente 1
produtoId  nome                quantidade  precoUnitario
1          'Teclado Mecânico'  3           250
2          'Mouse Sem Fio'     4           90
Total do pedido: R$ 1110.00
```

## Regras de negócio implementadas

**Produtos**
- O identificador deve ser único
- O nome não pode estar vazio
- O preço deve ser maior que zero
- O estoque deve ser um número inteiro maior ou igual a zero
- Um produto que já faz parte de algum pedido não pode ser removido, para preservar o histórico

**Clientes**
- Nome e e-mail são obrigatórios
- Identificador e e-mail devem ser únicos (o e-mail é comparado sem diferenciar maiúsculas de minúsculas)

**Carrinho**
- A quantidade deve ser um número inteiro maior que zero
- Não é possível adicionar produtos inexistentes
- Não é possível pedir quantidade superior ao estoque disponível, considerando o que o cliente já tem no carrinho
- Adicionar um produto que já está no carrinho atualiza a quantidade, sem duplicar linhas
- Subtotal = preço unitário × quantidade; total = soma dos subtotais (arredondados em 2 casas decimais)

**Pedidos**
- Não é possível finalizar pedido sem itens nem para cliente inexistente
- Cada pedido recebe um identificador único e a data de criação
- O pedido guarda o preço praticado no momento da compra, então mudanças futuras no catálogo não alteram pedidos anteriores
- O estoque só é reduzido depois que todos os itens são validados: se algum item não tiver estoque suficiente, nada é registrado e nenhum estoque é alterado (operação "tudo ou nada")

## Limitações conhecidas

- Os dados ficam apenas em memória: ao encerrar a aplicação, tudo é perdido e a próxima execução recomeça dos dados iniciais
- Os identificadores de produtos e clientes são informados manualmente; apenas os de pedidos são gerados automaticamente
- O carrinho não reserva estoque: a disponibilidade é conferida ao adicionar itens e novamente ao finalizar o pedido
- Um produto que está no carrinho de algum cliente, mas ainda não em um pedido, pode ser removido do catálogo; o carrinho desse cliente passa a dar erro ao ser listado, embora seja possível remover o item
- O e-mail do cliente é validado apenas quanto a estar preenchido, sem verificar o formato
- Não há testes automatizados com framework; a conferência dos resultados é feita pelas verificações do `main.ts`
- Não há interface, autenticação, pagamento, frete, cupons de desconto ou cálculo de impostos (fora do escopo do projeto)
