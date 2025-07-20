"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  job_type: string
  created_at: string
  user_id: string
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract']

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    job_type: ''
  })
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) fetchUserJobs()
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/auth')
      setUser(user)
    } catch {
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserJobs = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setJobs(data || [])
  }

  const resetForm = () => {
    setFormData({ title: '', company: '', description: '', location: '', job_type: '' })
    setEditingJob(null)
  }

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const action = editingJob ? 'update' : 'insert'
    const query = editingJob
      ? supabase.from('jobs').update(formData).eq('id', editingJob.id)
      : supabase.from('jobs').insert([{ ...formData, user_id: user.id, created_at: new Date().toISOString() }])
    const { error } = await query
    if (!error) {
      setIsDialogOpen(false)
      resetForm()
      fetchUserJobs()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await supabase.from('jobs').delete().eq('id', id)
    fetchUserJobs()
  }

  if (loading) return <Typography align="center">Loading...</Typography>

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography color="text.secondary">Welcome back, {user?.email}</Typography>
        </Box>
        <Box>
          <Button component={Link} href="/" variant="outlined">View All Jobs</Button>
          <Button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} variant="outlined" sx={{ ml: 1 }}>Sign Out</Button>
        </Box>
      </Box>

      <Button variant="contained" onClick={() => { resetForm(); setIsDialogOpen(true) }}>Post New Job</Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{editingJob ? 'Edit Job' : 'Post a New Job'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleDialogSubmit} sx={{ mt: 2 }}>
            <TextField fullWidth label="Job Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Company" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required sx={{ mb: 2 }} />
            <Select
              fullWidth
              displayEmpty
              value={formData.job_type}
              onChange={e => setFormData({ ...formData, job_type: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem disabled value="">
                Select Job Type
              </MenuItem>
              {JOB_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
            <TextField
              fullWidth
              label="Description"
              multiline
              minRows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">{editingJob ? 'Update' : 'Post'}</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Box mt={4}>
        <Typography variant="h6">Your Job Posts ({jobs.length})</Typography>
        {jobs.length === 0 ? (
          <Typography sx={{ mt: 2 }}>No jobs posted yet.</Typography>
        ) : (
          <Box mt={2} display="grid" gap={2}>
            {jobs.map(job => (
              <Card key={job.id}>
                <CardHeader title={job.title} subheader={job.company} />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{job.description}</Typography>
                  <Typography variant="caption" color="text.secondary">{job.location} • {job.job_type}</Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} href={`/jobs/${job.id}`} size="small">View</Button>
                  <Button size="small" onClick={() => { setEditingJob(job); setFormData(job); setIsDialogOpen(true) }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(job.id)}>Delete</Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
