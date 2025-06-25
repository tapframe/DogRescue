import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  GridLegacy as Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { applicationApi, ApplicationData } from '../../services/api';

const ApplicationManagementTab = () => {
  const theme = useTheme();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationApi.getAllApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedApplication || !newStatus) return;

    setUpdating(true);
    try {
      await applicationApi.updateApplicationStatus(
        selectedApplication._id!,
        newStatus,
        adminNotes.trim() || undefined
      );
      
      // Refresh applications list
      await fetchApplications();
      
      // Close dialog
      setEditDialogOpen(false);
      setSelectedApplication(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  // Get status chip
  const getStatusChip = (status: string) => {
    const statusColors = {
      'Pending': 'info',
      'Under Review': 'warning',
      'Approved': 'success',
      'Rejected': 'error',
      'Withdrawn': 'default'
    } as const;

    return (
      <Chip
        label={status}
        color={statusColors[status as keyof typeof statusColors] || 'default'}
        size="small"
        variant="filled"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'dog',
      headerName: 'Dog',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Avatar
            src={params.row.dog?.image}
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            <PetsIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {params.row.dog?.name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.dog?.breed}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'user',
      headerName: 'Applicant',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.user ? `${params.row.user.firstName} ${params.row.user.lastName}` : 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.user?.email}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.row.status)
    },
    {
      field: 'submittedAt',
      headerName: 'Submitted',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {formatDate(params.row.submittedAt)}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={() => {
                setSelectedApplication(params.row);
                setViewDialogOpen(true);
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Status">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setSelectedApplication(params.row);
                setNewStatus(params.row.status);
                setAdminNotes(params.row.adminNotes || '');
                setEditDialogOpen(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Application Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            label: 'Total Applications',
            value: applications.length,
            color: theme.palette.primary.main,
            icon: <PetsIcon />
          },
          {
            label: 'Pending Review',
            value: applications.filter(app => app.status === 'Pending').length,
            color: theme.palette.info.main,
            icon: <TimeIcon />
          },
          {
            label: 'Under Review',
            value: applications.filter(app => app.status === 'Under Review').length,
            color: theme.palette.warning.main,
            icon: <EditIcon />
          },
          {
            label: 'Approved',
            value: applications.filter(app => app.status === 'Approved').length,
            color: theme.palette.success.main,
            icon: <PersonIcon />
          }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                backgroundColor: alpha(stat.color, 0.05),
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
                <Box sx={{ color: alpha(stat.color, 0.3), fontSize: 40 }}>
                  {stat.icon}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Applications DataGrid */}
      <Paper elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <DataGrid
          rows={applications}
          columns={columns}
          getRowId={(row) => row._id || row.id}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }
          }}
        />
      </Paper>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Application Details
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Dog Information</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={selectedApplication.dog?.image}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      <PetsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedApplication.dog?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedApplication.dog?.breed}, {selectedApplication.dog?.age}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Applicant Information</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>
                      {selectedApplication.user ? 
                        `${selectedApplication.user.firstName} ${selectedApplication.user.lastName}` : 
                        'Unknown User'
                      }
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{selectedApplication.user?.email || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{selectedApplication.user?.phone || 'N/A'}</Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Application Details</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  {getStatusChip(selectedApplication.status)}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted On</Typography>
                  <Typography>{formatDate(selectedApplication.submittedAt)}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Application Notes</Typography>
                  <Typography>{selectedApplication.applicationNotes || 'No notes provided'}</Typography>
                </Box>
                {selectedApplication.adminNotes && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Admin Notes</Typography>
                    <Typography>{selectedApplication.adminNotes}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Application Status
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Admin Notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this application status update..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={updating || !newStatus}
          >
            {updating ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationManagementTab; 