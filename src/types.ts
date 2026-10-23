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
// assi mudanças futuras no catálogo não alterem pedidos já concluídos.
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
