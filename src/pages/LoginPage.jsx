import { useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material'
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const LoginPage = () => {
    const navigate = useNavigate()
    const { currentUser, isAdmin, login, register } = useAuth()

    const [authMode, setAuthMode] = useState('login')
    const [error, setError] = useState('')

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    if (currentUser) {
        return <Navigate to={isAdmin ? '/admin' : '/'} replace />
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            setError('')

            const user = await login(loginData)

            if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch (error) {
            setError(error.message || 'Could not login.')
            console.error(error)
        }
    }

    const handleRegister = async (event) => {
        event.preventDefault()

        try {
            setError('')

            await register(registerData)

            setRegisterData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            })

            setLoginData({
                email: registerData.email,
                password: '',
            })

            setAuthMode('login')
        } catch (error) {
            setError(error.message || 'Could not register.')
            console.error(error)
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            ScoutUp
                        </Typography>

                        <Typography color="text.secondary">
                            Login or create an account.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    <Tabs value={authMode} onChange={(_, value) => setAuthMode(value)}>
                        <Tab label="Login" value="login" />
                        <Tab label="Register" value="register" />
                    </Tabs>

                    {authMode === 'login' && (
                        <Box component="form" onSubmit={handleLogin}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={loginData.email}
                                    onChange={(event) =>
                                        setLoginData((currentData) => ({
                                            ...currentData,
                                            email: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={(event) =>
                                        setLoginData((currentData) => ({
                                            ...currentData,
                                            password: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                    required
                                />

                                <Button type="submit" variant="contained" size="large">
                                    Login
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {authMode === 'register' && (
                        <Box component="form" onSubmit={handleRegister}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Name"
                                    value={registerData.name}
                                    onChange={(event) =>
                                        setRegisterData((currentData) => ({
                                            ...currentData,
                                            name: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={(event) =>
                                        setRegisterData((currentData) => ({
                                            ...currentData,
                                            email: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Password"
                                    type="password"
                                    value={registerData.password}
                                    onChange={(event) =>
                                        setRegisterData((currentData) => ({
                                            ...currentData,
                                            password: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                    required
                                />

                                <TextField
                                    label="Confirm password"
                                    type="password"
                                    value={registerData.password_confirmation}
                                    onChange={(event) =>
                                        setRegisterData((currentData) => ({
                                            ...currentData,
                                            password_confirmation: event.target.value,
                                        }))
                                    }
                                    fullWidth
                                    required
                                />

                                <Button type="submit" variant="contained" size="large">
                                    Register
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </Paper>
        </Container>
    )
}

export default LoginPage