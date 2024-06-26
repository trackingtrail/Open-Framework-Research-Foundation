import React, { Suspense, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import Home from './components/Home';
import ChatBotNew from './components/ChatBot'; // Assuming ChatBotNew is in the components folder
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackBarContext';
import { CircularProgress, Box, Button } from '@mui/material';

import ForumIcon from '@mui/icons-material/Forum';

const UploaderRegistrationForm = React.lazy(() => import('./components/UploaderRegistration'))
const SolverRegistrationForm = React.lazy(() => import('./components/SolverRegistration'))
const CreateProblemForm = React.lazy(() => import('./components/CreateProblem'))
const ProblemDetails = React.lazy(() => import('./components/ProblemDetails'))
const SolutionForm = React.lazy(() => import('./components/CreateSolution'));
const SolverProfile = React.lazy(() => import('./components/SolverProfile'));
const UploaderProfile = React.lazy(() => import('./components/UploaderProfile'));



function LoggedInAuthRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to='/' /> : children
}

function SolverPrivateRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return currentUser?.role === 'solver' ? children : <Navigate to='/' />;
}

function UploaderPrivateRoute({ children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return currentUser?.role === 'uploader' ? children : <Navigate to='/' />;
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to='/login' />
}

function App() {
  const [showChatBot, setShowChatBot] = useState(false);

  const toggleChatBot = () => setShowChatBot(!showChatBot);

  return (
    <AuthProvider>
      <SnackbarProvider>
        <Router>
          <NavigationBar />
          <main style={{ flexGrow: 1 }}>
            <Suspense
              fallback={
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  height='100vh'
                >
                  <CircularProgress />
                </Box>
              }
            >
              <Routes>
                <Route path='/' element={<Home />} />
                <Route
                  path='/login'
                  element={
                    <LoggedInAuthRoute>
                      <Login />
                    </LoggedInAuthRoute>
                  }
                />
                <Route
                  path='/register/uploader'
                  element={
                    <LoggedInAuthRoute>
                      <UploaderRegistrationForm />
                    </LoggedInAuthRoute>
                  }
                />
                <Route
                  path='/register/solver'
                  element={
                    <LoggedInAuthRoute>
                      <SolverRegistrationForm />
                    </LoggedInAuthRoute>
                  }
                />
                <Route
                  path='/create-problem'
                  element={
                    <UploaderPrivateRoute>
                      <CreateProblemForm />
                    </UploaderPrivateRoute>
                  }
                />
                <Route path='/submit-solution/:problemId' element={
                  <SolverPrivateRoute>
                    <SolutionForm />
                  </SolverPrivateRoute>
                }
                />
                <Route
                  path='/problems/:problemId'
                  element={<ProblemDetails />}
                />
                <Route
                  path='/profile/solver'
                  element={
                    <SolverPrivateRoute>
                      <SolverProfile />
                    </SolverPrivateRoute>
                  }
                />
                <Route
                  path='/profile/uploader'
                  element={
                    <UploaderPrivateRoute>
                      <UploaderProfile />
                    </UploaderPrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
            <Button onClick={toggleChatBot} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
              <ForumIcon style={{ padding: "1.6rem", border: 'solid black 1px', color: 'black', fontSize: '2rem', backgroundColor: 'white', borderRadius: '1.6rem' }} />
            </Button>
            {showChatBot && <ChatBotNew onClose={toggleChatBot} />}
          </main>
        </Router>
      </SnackbarProvider>
    </AuthProvider >
  )
}

export default App