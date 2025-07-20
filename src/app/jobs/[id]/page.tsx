'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

export default function JobDetailPage() {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const params = useParams()
  const jobId = params.id as string

  useEffect(() => {
    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true)
        } else {
          throw error
        }
      } else {
        setJob(data)
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
        <Typography variant="body1" align="center">Loading job details...</Typography>
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
        <Card>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
            <Typography variant="h5" gutterBottom>Job Not Found</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {`The job you're looking for doesn't exist or has been removed.`}
            </Typography>
            <Link href="/" passHref>
              <Button variant="contained">Back to Job Board</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" passHref>
          <Typography variant="body2" color="text.secondary">← Back to all jobs</Typography>
        </Link>
      </div>

      <Card>
        <CardHeader title={job.title} subheader={job.company} />
        <CardContent>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Chip label={job.job_type} color="primary" />
            <Chip label={job.location} variant="outlined" />
          </div>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Job Description</Typography>
          <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-wrap' }}>{job.description}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>About {job.company}</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This position is with {job.company}, located in {job.location}. For more information about this opportunity, please contact the company directly.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="contained">Apply</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
