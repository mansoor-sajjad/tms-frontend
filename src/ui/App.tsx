import { useEffect } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AppBar, Box, Button, Container, CssBaseline, Stack, Toolbar, Typography } from '@mui/material'
import { attachAuthInterceptor } from '../api/http'
import { useAuth } from '../security/AuthProvider'
import BrokersPage from './brokers/BrokersPage'
import CreatePartyPage from './parties/CreatePartyPage'
import CreateLoadPage from './loads/CreateLoadPage'
import AddStopsPage from './loads/AddStopsPage'
import UpdateStatusPage from './loads/UpdateStatusPage'

export default function App() {
  const { token, username } = useAuth()

  useEffect(() => {
    attachAuthInterceptor(() => token)
  }, [token])

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>TMS</Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/brokers">Brokers</Button>
            <Button color="inherit" component={Link} to="/parties/new">New Party</Button>
            <Button color="inherit" component={Link} to="/loads/new">New Load</Button>
          </Stack>
          <Box sx={{ ml: 2, opacity: 0.8 }}>{username}</Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/brokers" />} />
          <Route path="/brokers" element={<BrokersPage />} />
          <Route path="/parties/new" element={<CreatePartyPage />} />
          <Route path="/loads/new" element={<CreateLoadPage />} />
          <Route path="/loads/:id/stops" element={<AddStopsPage />} />
          <Route path="/loads/:id/status" element={<UpdateStatusPage />} />
        </Routes>
      </Container>
    </Box>
  )
}
