// Tipos usados em todo o sistema.

export type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number; // preço unitário, sempre maior que zero
  estoque: number; // quantidade disponível, nunca negativa
};

export type Cliente = {
  id: number;
  nome: string;
  email: string;
};

export type ItemCarrinho = {
  produtoId: number;
  quantidade: number; // sempre maior que zero
};

// Item de pedido guarda o preço praticado no momento da compra,
// para que mudanças futuras no catálogo não alterem pedidos antigos.
export type ItemPedido = {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

export type Pedido = {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: Date;
};

// Cada cliente tem o seu próprio carrinho.
export type Carrinho = {
  clienteId: number;
  itens: ItemCarrinho[];
};

// Item do carrinho com os dados do produto e o subtotal já calculados (para exibição).
export type LinhaCarrinho = {
  produtoId: number;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
};