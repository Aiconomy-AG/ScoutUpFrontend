import { Container, Paper, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const ProtectedAdminRoute = ({ children }) => {
    const { authChecked, isAuthenticated, isAdmin } = useAuth()

    if (!authChecked) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5">Loading...</Typography>
                </Paper>
            </Container>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedAdminRoute