import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { createBroker, listBrokers } from '../../api/brokers'
import { useForm } from 'react-hook-form'

export default function BrokersPage() {
  const qc = useQueryClient()
  const { data = [], isLoading, isError } = useQuery({ queryKey: ['brokers'], queryFn: listBrokers })
  const create = useMutation({
    mutationFn: createBroker,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brokers'] }),
  })

  const { register, handleSubmit, reset } = useForm<{ name: string; billingEmail?: string; updateEmail?: string }>()

  const onSubmit = handleSubmit(async (v) => {
    await create.mutateAsync({ name: v.name, billingEmail: v.billingEmail, updateEmail: v.updateEmail })
    reset()
  })

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'billingEmail', headerName: 'Billing Email', flex: 1 },
    { field: 'updateEmail', headerName: 'Update Email', flex: 1 },
  ]

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Brokers</Typography>
      {isError && <Alert severity="error">Failed to load brokers</Alert>}
      <Paper sx={{ height: 360 }}>
        <DataGrid rows={data} columns={cols} loading={isLoading} disableRowSelectionOnClick pageSizeOptions={[5,10]} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Create Broker</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 2 }}>
          <TextField label="Name" required {...register('name', { required: true })} />
          <TextField label="Billing Email" type="email" {...register('billingEmail')} />
          <TextField label="Update Email" type="email" {...register('updateEmail')} />
          <Button variant="contained" type="submit" disabled={create.isPending}>Save</Button>
        </Box>
      </Paper>
    </Stack>
  )
}
