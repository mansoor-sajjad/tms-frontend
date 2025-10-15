import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { createParty } from '../../api/parties'

export default function CreatePartyPage() {
  const { register, handleSubmit, reset } = useForm<{ name: string; address?: string; phone?: string }>()
  const create = useMutation({ mutationFn: createParty })

  const onSubmit = handleSubmit(async (v) => {
    await create.mutateAsync({ name: v.name, address: v.address, phone: v.phone })
    reset()
  })

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create Party</Typography>
      {create.isError && <Alert severity="error">Failed to save party</Alert>}
      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 2 }}>
          <TextField label="Name" required {...register('name', { required: true })} />
          <TextField label="Address" {...register('address')} />
          <TextField label="Phone" {...register('phone')} />
          <Button variant="contained" type="submit" disabled={create.isPending}>Save</Button>
        </Box>
      </Paper>
    </Stack>
  )
}
