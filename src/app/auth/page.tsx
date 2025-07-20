'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Tabs,
  Tab,
  Alert,
} from '@mui/material'

export default function AuthPage() {
  const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setMessage('Check your email for the confirmation link!')
     } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An unknown error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An unknown error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={8} px={2}>
      <Box mb={2}>
        <Link href="/" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>
          ← Back to jobs
        </Link>
      </Box>

      <Card>
        <CardHeader
          title="Welcome"
          subheader="Sign in to your account or create a new one"
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          subheaderTypographyProps={{ align: 'center' }}
        />
        <CardContent>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {tab === 0 && (
            <form onSubmit={handleSignIn}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </CardActions>
            </form>
          )}

          {tab === 1 && (
            <form onSubmit={handleSignUp}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                inputProps={{ minLength: 6 }}
              />
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </CardActions>
            </form>
          )}

          {message && (
            <Alert
              severity={message.includes('Check your email') ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}