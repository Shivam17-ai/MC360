import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { medicineService } from '../services/medicineService'
import toast from 'react-hot-toast'

export const useMedicines = () => {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => medicineService.getAll().then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: medicineService.create,
    onSuccess: () => { qc.invalidateQueries(['medicines']); toast.success('Medicine added') },
    onError: (e) => toast.error(e.message),
  })

  const remove = useMutation({
    mutationFn: medicineService.delete,
    onSuccess: () => { qc.invalidateQueries(['medicines']); toast.success('Medicine removed') },
    onError: (e) => toast.error(e.message),
  })

  return { medicines: data || [], isLoading, create, remove }
}