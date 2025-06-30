export interface Employee {
  _id: string
  nome: string
  dataNascimento: string
  cpf: string
  rg: string
  email: string
  dataContratacao: string
  sexo: 'feminino' | 'masculino'
  cargo: string
  departamento: string
  ativo: boolean
}
