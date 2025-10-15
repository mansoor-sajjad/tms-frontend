import { Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography, MenuItem } from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { addStops } from '../../api/loads'
import { useNavigate, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'

export default function AddStopsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { control, register, handleSubmit } = useForm<{ stops: { type: 'PU' | 'DL'; partyId: number }[] }>({
    defaultValues: { stops: [{ type: 'PU', partyId: 1 }, { type: 'DL', partyId: 1 }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'stops' })
  const mutate = useMutation({ mutationFn: (payload: any) => addStops(Number(id!), payload.stops) })

  const onSubmit = handleSubmit(async (v) => {
    await mutate.mutateAsync(v)
    nav(`/loads/${id}/status`)
  })

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Add Stops (Load {id})</Typography>
      {mutate.isError && <Alert severity="error">Failed to add stops</Alert>}
      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            {fields.map((f, idx) => (
              <Stack key={f.id} direction="row" spacing={2} alignItems="center">
                <TextField select label="Type" sx={{ width: 120 }} defaultValue={f.type} {...register(`stops.${idx}.type` as const)}>
                  <MenuItem value="PU">PU</MenuItem>
                  <MenuItem value="DL">DL</MenuItem>
                </TextField>
                <TextField label="Party ID" type="number" sx={{ width: 200 }} defaultValue={f.partyId} {...register(`stops.${idx}.partyId` as const, { valueAsNumber: true })} />
                <IconButton onClick={() => remove(idx)} aria-label="remove"><DeleteIcon/></IconButton>
              </Stack>
            ))}
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => append({ type: 'PU', partyId: 1 })}>Add Stop</Button>
              <Button variant="contained" type="submit" disabled={mutate.isPending}>Next: Status</Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}
