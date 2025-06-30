import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import type { AppDispatch } from '../app/store'
import { useState } from 'react'
import { useFormik } from 'formik'
import { updateEmployee } from '../features/employees/employeesSlice'
import { ArrowLeftIcon } from './ui/icons'
import { ToggleSwitch } from './ui/ToggleSwitch'
import { RadioGroup } from './ui/RadioGroup'
import type { Employee } from '../models/employee.model'

interface EditEmployeesFormProps {
  employee: Employee
  onCancel: () => void
  onSuccess: () => void
}

const validationSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório.'),
  dataNascimento: yup.string().required('Data de nascimento é obrigatório.'),
  cpf: yup.string().required('CPF é obrigatório.'),
  rg: yup.string().required('RG é obrigatório.'),
  email: yup.string().required('E-mail é obrigatório.'),
  sexo: yup
    .string()
    .required('Sexo é obrigatório.')
    .oneOf(['feminino', 'masculino', 'outro'], 'Sexo é obrigatório.'),
  dataContratacao: yup.string().required('Data de contratação é obrigatória.'),
  cargo: yup.string().required('Cargo é obrigatório.'),
  departamento: yup.string().required('Departamento é obrigatório.'),
  ativo: yup.boolean().required(),
})

export function EditEmployeeForm({
  employee,
  onCancel,
  onSuccess,
}: EditEmployeesFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      id: employee._id,
      nome: employee.nome,
      dataNascimento: employee.dataNascimento.split('T')[0],
      cpf: employee.cpf,
      rg: employee.rg,
      email: employee.email,
      dataContratacao: employee.dataContratacao.split('T')[0],
      sexo: employee.sexo,
      cargo: employee.cargo,
      departamento: employee.departamento,
      ativo: employee.ativo,
    },
    validationSchema,

    onSubmit: async (values) => {
      setError(null)
      setIsSubmiting(true)

      try {
        const { id, ...rest } = values
        const employeeToUpdate = {
          id,
          data: {
            ...rest,
            sexo: values.sexo as 'feminino' | 'masculino' | 'outro',
          },
        }

        await dispatch(updateEmployee(employeeToUpdate)).unwrap()
        onSuccess()
      } catch (err) {
        setError(
          'Erro ao editar dados do funcionário. Por favor, tente novamente.'
        )
        console.error('Erro ao editar dados do funcionário.', err)
      } finally {
        setIsSubmiting(false)
      }
    },
  })

  return (
    <div className='flex flex-col flex-1 rounded-t-2xl bg-white shadow-sm relative overflow-hidden'>
      <div className='bg-indigo-600 text-white px-4 md:px-6 py-3 rounded-t-2xl flex items-center gap-4'>
        <button
          onClick={onCancel}
          className='text-white cursor-pointer'
          disabled={isSubmiting}
        >
          <ArrowLeftIcon />
        </button>

        <h2 className='text-3xl font-bold text-white'>Editar Funcionário</h2>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className='p-4 md:p-6 space-y-4 md:space-y-6'
      >
        {error && (
          <div className='p-3 text-red-700 text-sm md:text-base'>{error}</div>
        )}

        <div className='flex flex-col md:flex-row items-start md:items-center justify-between border border-indigo-600 shadow-sm rounded-xl p-3 gap-3'>
          <span className='text-sm md:text-base font-medium'>
            O trabalhador está ativo ou inativo?
          </span>

          <ToggleSwitch
            value={formik.values.ativo}
            onChange={(value) => formik.setFieldValue('ativo', value)}
            disabled={isSubmiting}
          />
        </div>

        <div className='flex md:flex-row border border-indigo-700 shadow-sm rounded-xl p-3 gap-4 md:gap-6'>
          <div className='flex flex-col w-full md:w-1/2 gap-4'>
            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>Nome</label>
              <input
                type='text'
                placeholder='Nome'
                name='nome'
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.nome && formik.errors.nome
                    ? 'border-red-500'
                    : 'border-indigo-500'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              />
              {formik.touched.nome && formik.errors.nome && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.nome}
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>
                Data de Nascimento
              </label>
              <input
                type='date'
                placeholder='Data de nascimento'
                name='dataNascimento'
                value={formik.values.dataNascimento}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.dataNascimento && formik.errors.dataNascimento
                    ? 'border-red-500'
                    : 'border-indigo-500'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              />
              {formik.touched.dataNascimento &&
                formik.errors.dataNascimento && (
                  <div className='text-red-500 text-xs md:text-sm'>
                    {formik.errors.dataNascimento}
                  </div>
                )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>CPF</label>
              <input
                type='text'
                placeholder='CPF'
                name='cpf'
                value={formik.values.cpf}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.cpf && formik.errors.cpf
                    ? 'border-red-500'
                    : 'border-indigo-500'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              />
              {formik.touched.cpf && formik.errors.cpf && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.cpf}
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>RG</label>
              <input
                type='text'
                placeholder='RG'
                name='rg'
                value={formik.values.rg}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.rg && formik.errors.rg
                    ? 'border-red-500'
                    : 'border-indigo-500'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              />
              {formik.touched.rg && formik.errors.rg && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.rg}
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>
                E-mail
              </label>
              <input
                type='email'
                placeholder='E-mail'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-indigo-500'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col w-1/2 gap-6 justify-between'>
            <div className='space-y-2'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>Sexo</label>
              <RadioGroup
                options={[
                  { value: 'feminino', label: 'Feminino' },
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'outro', label: 'Outro' },
                ]}
                selectedValue={formik.values.sexo}
                onChange={(value) => formik.setFieldValue('sexo', value)}
                disabled={isSubmiting}
              />
              {formik.touched.sexo && formik.errors.sexo && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.sexo}
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>Cargo</label>
              <select
                name='cargo'
                value={formik.values.cargo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.cargo && formik.errors.cargo
                    ? 'border-red-500'
                    : 'border-indigo-700'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              >
                <option value='' disabled className='text-gray-200'>
                  Selecione um cargo
                </option>

                <option value='Analista de QA'>Analista de QA</option>
                <option value='Analista de RH'>Analista de RH</option>
                <option value='Desenvolvedor Backend Junior'>
                  Desenvolvedor Backend Junior
                </option>
                <option value='Desenvolvedor Backend Pleno'>
                  Desenvolvedor Backend Pleno
                </option>
                <option value='Desenvolvedor Backend Senior'>
                  Desenvolvedor Backend Sênior
                </option>
                <option value='Desenvolvedor Frontend Junior'>
                  Desenvolvedor Frontend Junior
                </option>
                <option value='Desenvolvedor Frontend Pleno'>
                  Desenvolvedor Frontend Pleno
                </option>
                <option value='Desenvolvedor Frontend Senior'>
                  Desenvolvedor Frontend Sênior
                </option>
                <option value='Desenvolvedor Fullstack Junior'>
                  Desenvolvedor Fullstack Junior
                </option>
                <option value='Desenvolvedor Fullstack Pleno'>
                  Desenvolvedor Fullstack Pleno
                </option>
                <option value='Desenvolvedor Fullstack Senior'>
                  Desenvolvedor Fullstack Sênior
                </option>
                <option value='DevOps Junior'>DevOps Junior</option>
                <option value='DevOps Pleno'>DevOps Pleno</option>
                <option value='DevOps Senior'>DevOps Sênior</option>
                <option value='Estagiario'>Estagiário</option>
                <option value='Gerente de Projetos'>Gerente de Projetos</option>
                <option value='UI/UX Designer'>UI/UX Designer</option>
              </select>
              {formik.touched.cargo && formik.errors.cargo && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.cargo}
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>
                Departamento
              </label>
              <select
                name='departamento'
                value={formik.values.departamento}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.departamento && formik.errors.departamento
                    ? 'border-red-500'
                    : 'border-indigo-700'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              >
                <option value='' disabled>
                  Selecione um departamento
                </option>
                <option value='Engenharia'>Engenharia</option>
                <option value='Marketing'>Marketing</option>
                <option value='Produto'>Produto</option>
                <option value='RH'>RH</option>
              </select>
              {formik.touched.departamento && formik.errors.departamento && (
                <div className='text-red-500 text-xs md:text-sm'>
                  {formik.errors.departamento}
                </div>
              )}
            </div>

            <div className='flex flex-col'>
              <label className='mb-1 md:mb-2 text-sm md:text-base'>
                Data de Contratação
              </label>
              <input
                type='date'
                placeholder='Data de Contratação'
                name='dataContratacao'
                value={formik.values.dataContratacao}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border ${
                  formik.touched.dataContratacao &&
                  formik.errors.dataContratacao
                    ? 'border-red-500'
                    : 'border-indigo-500'
                } px-3 py-2 rounded-lg text-sm md:text-base`}
                disabled={isSubmiting}
              />
              {formik.touched.dataContratacao &&
                formik.errors.dataContratacao && (
                  <div className='text-red-500 text-xs md:text-sm'>
                    {formik.errors.dataContratacao}
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className='flex w-full'>
          <button
            type='submit'
            className={`w-full px-10 py-2.5 border border-indigo-700 rounded-xl hover:border-indigo-500 text-indigo-700 hover:text-indigo-500 transition-colors duration-300 ${
              isSubmiting ? 'cursor-wait' : 'cursor-pointer'
            }`}
          >
            {isSubmiting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
