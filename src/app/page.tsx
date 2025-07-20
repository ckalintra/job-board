'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  job_type: string
  created_at: string
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch {
      setUser(null)
    }
  }

  const handleSignout = async () => {
    await supabase.auth.signOut();
    router.push('/')
  }

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setJobs(data || [])
      setLoading(false)
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      (!locationFilter || job.location === locationFilter) &&
      (!typeFilter || job.job_type === typeFilter)
    )
    setFilteredJobs(filtered)
  }, [jobs, locationFilter, typeFilter])

  const unique = (arr: string[]) => [...new Set(arr)]

  if (loading) {
    return (
      <Box sx={{ px: 4, py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading jobs...</Typography>
      </Box>
    )
  }

  const handleViewJob = async (id: string) => {
    router.push(`/jobs/${id}`)
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 4, py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold">Job Dev</Typography>
          <Typography variant="body1" color="text.secondary">Find your next opportunity</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user ? 
            <div>
              <Link href="/dashboard" passHref>
                <Button variant="contained">Dashboard</Button>
              </Link>
              <Button onClick={() => handleSignout} variant="outlined" sx={{ ml: 1 }}>Sign Out</Button>
            </div>
          : 
            <Link href="/auth" passHref>
              <Button variant="outlined">Sign In</Button>
            </Link>
          }
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={locationFilter}
            label="Location"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <MenuItem value="">All Locations</MenuItem>
            {unique(jobs.map(j => j.location)).map(loc => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Job Type</InputLabel>
          <Select
            value={typeFilter}
            label="Job Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            {unique(jobs.map(j => j.job_type)).map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {(locationFilter || typeFilter) && (
          <Button onClick={() => { setLocationFilter(''); setTypeFilter('') }}>
            Clear Filters
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>No jobs found</Typography>
              <Link href="/auth" passHref>
                <Button variant="contained">Post a Job</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} sx={{ '&:hover': { boxShadow: 4 } }} onClick={() => handleViewJob(job.id)}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{job.company}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={job.job_type} color="primary" />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {job.description.length > 150
                    ? `${job.description.slice(0, 150)}...`
                    : job.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </Typography>
                  <Chip label={job.location} variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  )
}