import { Cliente } from "./types";

// Dados iniciais de clientes (mínimo de 3, para facilitar os testes).
export const clientes: Cliente[] = [
  { id: 1, nome: "Ana Souza", email: "ana.souza@email.com" },
  { id: 2, nome: "Bruno Lima", email: "bruno.lima@email.com" },
  { id: 3, nome: "Carla Mendes", email: "carla.mendes@email.com" },
];

// Nome e e-mail são obrigatórios.
function validarDados(nome: string, email: string): void {
  if (nome.trim() === "") {
    throw new Error("O nome do cliente deve ser informado.");
  }
  if (email.trim() === "") {
    throw new Error("O e-mail do cliente deve ser informado.");
  }
}

export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((cliente) => cliente.id === id);
}

export function cadastrarCliente(cliente: Cliente): Cliente {
  validarDados(cliente.nome, cliente.email);

  if (buscarClientePorId(cliente.id) !== undefined) {
    throw new Error(`Já existe um cliente com o id ${cliente.id}.`);
  }

  // O e-mail é comparado sem diferenciar maiúsculas de minúsculas.
  const email = cliente.email.trim();
  const emailJaUsado = clientes.some(
    (existente) => existente.email.toLowerCase() === email.toLowerCase()
  );
  if (emailJaUsado) {
    throw new Error(`Já existe um cliente com o e-mail ${email}.`);
  }

  const novoCliente: Cliente = { id: cliente.id, nome: cliente.nome.trim(), email };
  clientes.push(novoCliente);
  return novoCliente;
}

// Retorna uma cópia do array, para não expor a lista original.
export function listarClientes(): Cliente[] {
  return [...clientes];
}