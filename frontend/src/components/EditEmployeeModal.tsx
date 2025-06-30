import { useDispatch } from 'react-redux'
import * as yup from 'yup'
import type { AppDispatch } from '../app/store'
import { useState } from 'react'
import { useFormik } from 'formik'
import { updateEmployee } from '../features/employees/employeesSlice'
import { ArrowLeftIcon } from './ui/icons'
import { ToggleSwitch } from './ui/ToggleSwitch'
import type { Employee } from '../models/employee.model'

interface EditEmployeesModalProps {
  employee: Employee
  onCancel: () => void
  onSuccess: () => void
}

const validationSchema = yup.object({
  dataContratacao: yup.string().required('Data de contratação é obrigatória.'),
  cargo: yup.string().required('Cargo é obrigatório.'),
  departamento: yup.string().required('Departamento é obrigatório.'),
  ativo: yup.boolean().required(),
})

export function EditEmployeeModal({
  employee,
  onCancel,
  onSuccess,
}: EditEmployeesModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: employee._id,
      dataContratacao: employee.dataContratacao.split('T')[0],
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
    <div className='fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4'>
      <div className='flex flex-col flex-1 rounded-2xl bg-white shadow-sm relative overflow-hidden w-full max-w-lg max-h-[90vh]'>
        <div className='bg-indigo-600 text-white px-4 md:px-6 py-3 rounded-t-2xl flex items-center gap-4'>
          <button
            onClick={onCancel}
            className='text-white cursor-pointer'
            disabled={isSubmiting}
          >
            <ArrowLeftIcon />
          </button>

          <h2 className='text-3xl font-bold text-white'>
            Editando {employee.nome}
          </h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto'
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
            <div className='flex flex-col gap-6 justify-between'>
              <div className='flex flex-col'>
                <label className='mb-1 md:mb-2 text-sm md:text-base'>
                  Cargo
                </label>
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
                  <option value='Gerente de Projetos'>
                    Gerente de Projetos
                  </option>
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
          <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onCancel}
              disabled={isSubmiting}
              className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                isSubmiting ? 'cursor-wait opacity-70' : ''
              }`}
              disabled={isSubmiting}
            >
              {isSubmiting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
