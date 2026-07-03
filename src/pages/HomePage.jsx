import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const HomePage = () => {
    const { currentUser, isAdmin, logout } = useAuth()

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <SportsSoccerIcon sx={{ mr: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ScoutUp
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Stack direction="row" spacing={2}>
                        {currentUser ? (
                            <>
                                {isAdmin && (
                                    <Button color="inherit" component={RouterLink} to="/admin">
                                        Admin
                                    </Button>
                                )}

                                <Button color="inherit" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" component={RouterLink} to="/login">
                                Login
                            </Button>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h3" fontWeight={800}>
                            ScoutUp
                        </Typography>

                        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                            Football scouting platform for teams and players.
                        </Typography>
                    </Box>

                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h5" fontWeight={700}>
                                    Welcome
                                </Typography>

                                <Typography color="text.secondary">
                                    This is the public home page. The admin area contains the team and player management features.
                                </Typography>

                                {currentUser ? (
                                    <Typography>
                                        You are logged in as <strong>{currentUser.name}</strong>.
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="contained"
                                        component={RouterLink}
                                        to="/login"
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        Login
                                    </Button>
                                )}

                                {isAdmin && (
                                    <Button
                                        variant="outlined"
                                        component={RouterLink}
                                        to="/admin"
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        Go to Admin Dashboard
                                    </Button>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Box>
    )
}

export default HomePage