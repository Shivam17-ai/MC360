import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { healthMetricsService } from '../services/healthMetricsService'
import toast from 'react-hot-toast'

export const useHealthMetrics = (type) => {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['health-metrics', type],
    queryFn: () => healthMetricsService.getAll(type).then((r) => r.data),
  })

  const add = useMutation({
    mutationFn: healthMetricsService.add,
    onSuccess: () => { qc.invalidateQueries(['health-metrics']); toast.success('Metric recorded') },
    onError: (e) => toast.error(e.message),
  })

  const addBulk = useMutation({
    mutationFn: healthMetricsService.addBulk,
    onSuccess: (res) => {
      qc.invalidateQueries(['health-metrics'])
      toast.success(`${res.data?.count ?? 'All'} vitals logged successfully`)
    },
    onError: (e) => toast.error(e.message),
  })

  return { metrics: data || [], isLoading, add, addBulk }
}