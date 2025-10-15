import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { createLoad } from '../../api/loads'
import { useNavigate } from 'react-router-dom'

export default function CreateLoadPage() {
  const { register, handleSubmit } = useForm<{ internalLoadNo: string; brokerId: number }>()
  const nav = useNavigate()
  const create = useMutation({ mutationFn: createLoad })

  const onSubmit = handleSubmit(async (v) => {
    const load = await create.mutateAsync({ internalLoadNo: v.internalLoadNo, brokerId: Number(v.brokerId) })
    nav(`/loads/${load.id}/stops`)
  })

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create Load</Typography>
      {create.isError && <Alert severity="error">Failed to create load</Alert>}
      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2 }}>
          <TextField label="Internal Load #" required {...register('internalLoadNo', { required: true })} />
          <TextField label="Broker ID" required type="number" {...register('brokerId', { required: true, valueAsNumber: true })} />
          <Button variant="contained" type="submit" disabled={create.isPending}>Next: Stops</Button>
        </Box>
      </Paper>
    </Stack>
  )
}
