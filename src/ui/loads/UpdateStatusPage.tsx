import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { updateStatus } from '../../api/loads'
import { useParams } from 'react-router-dom'

const statuses = ['PLANNED','DISPATCHED','AT_PICKUP','LOADED_AND_ROLLING','AT_DELIVERY','BROKE_DOWN','DELIVERED']

export default function UpdateStatusPage() {
  const { id } = useParams()
  const mutate = useMutation({ mutationFn: (status: string) => updateStatus(Number(id!), status) })

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Update Status (Load {id})</Typography>
      {mutate.isError && <Alert severity="error">Failed to update status</Alert>}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField select label="Status" defaultValue={statuses[0]} onChange={(e) => mutate.mutate(e.target.value)} sx={{ width: 300 }}>
            {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <Button variant="contained" onClick={() => mutate.mutate('DISPATCHED')} disabled={mutate.isPending}>Set DISPATCHED</Button>
        </Box>
      </Paper>
    </Stack>
  )
}
