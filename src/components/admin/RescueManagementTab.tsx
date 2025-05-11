import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Alert,
  TablePagination,
  GridLegacy as Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';

import { rescueApi, RescueSubmissionData } from '../../services/api';

type StatusType = 'pending' | 'processing' | 'rescued' | 'closed';

interface RescueManagementTabProps {
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

const RescueManagementTab = ({ showNotification }: RescueManagementTabProps) => {
  const theme = useTheme();
  const [rescueSubmissions, setRescueSubmissions] = useState<RescueSubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Detail view state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<RescueSubmissionData | null>(null);
  
  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<RescueSubmissionData | null>(null);
  const [editStatus, setEditStatus] = useState<StatusType>('pending');
  const [editNotes, setEditNotes] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch rescue submissions data
  useEffect(() => {
    const fetchRescueSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await rescueApi.getAllRescueSubmissions();
        setRescueSubmissions(data);
      } catch (err) {
        console.error('Error fetching rescue submissions:', err);
        setError('Failed to load rescue submissions. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchRescueSubmissions();
  }, []);

  // Handle viewing submission details
  const handleViewDetails = (submission: RescueSubmissionData) => {
    setSelectedSubmission(submission);
    setDetailOpen(true);
  };

  // Handle edit dialog
  const handleEditOpen = (submission: RescueSubmissionData) => {
    setEditingSubmission(submission);
    setEditStatus(submission.status as StatusType || 'pending');
    setEditNotes('');
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleStatusChange = (event: any) => {
    setEditStatus(event.target.value as StatusType);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditNotes(event.target.value);
  };

  // Handle saving status changes
  const handleSaveStatus = async () => {
    if (!editingSubmission) return;
    
    try {
      await rescueApi.updateRescueSubmission(editingSubmission._id as string, {
        status: editStatus,
        // In a real app, you would also save the notes to the backend
      });
      
      // Update local state
      setRescueSubmissions(prev => 
        prev.map(submission => 
          submission._id === editingSubmission._id 
            ? { ...submission, status: editStatus } 
            : submission
        )
      );
      
      showNotification('Rescue submission status updated successfully', 'success');
      handleEditClose();
    } catch (err) {
      console.error('Error updating rescue submission:', err);
      showNotification('Failed to update rescue submission status', 'error');
    }
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get status chip color and label
  const getStatusChip = (status?: string) => {
    switch (status) {
      case 'processing':
        return (
          <Chip 
            label="Processing" 
            size="small" 
            color="warning" 
            sx={{ fontWeight: 500 }}
          />
        );
      case 'rescued':
        return (
          <Chip 
            label="Rescued" 
            size="small" 
            color="success" 
            sx={{ fontWeight: 500 }}
          />
        );
      case 'closed':
        return (
          <Chip 
            label="Closed" 
            size="small" 
            color="error" 
            sx={{ fontWeight: 500 }}
          />
        );
      case 'pending':
      default:
        return (
          <Chip 
            label="Pending" 
            size="small" 
            color="info" 
            sx={{ fontWeight: 500 }}
          />
        );
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Render empty state
  if (!loading && rescueSubmissions.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <PetsIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.6), mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={600}>
            No Rescue Submissions Yet
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            When users submit rescue requests through the rescue form, they will appear here.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ mt: 2, px: 3, py: 1, borderRadius: 2 }}
            onClick={() => window.open('/rescue', '_blank')}
          >
            View Rescue Form
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 240px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                <TableCell>ID</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Dog Details</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Loading rescue submissions...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rescueSubmissions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((submission) => (
                    <TableRow key={submission._id} hover>
                      <TableCell component="th" scope="row">
                        #{submission.id || submission._id?.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {submission.contactName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {submission.contactEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={submission.location}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {submission.location}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {submission.name || 'Unnamed'} • {submission.breed || 'Unknown breed'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {submission.gender} • {submission.age} • {submission.size}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(submission.submittedAt)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(submission.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(submission)}
                              sx={{ 
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              onClick={() => handleEditOpen(submission)}
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rescueSubmissions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Details Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ px: 3, pt: 3, fontWeight: 600 }}>
          Rescue Submission Details
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          {selectedSubmission && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="overline" color="textSecondary">
                  Submission ID
                </Typography>
                <Typography variant="body1">
                  #{selectedSubmission.id || selectedSubmission._id}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="textSecondary">
                  Dog Information
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">Name</Typography>
                      <Typography variant="body2">{selectedSubmission.name || 'Unknown'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Breed</Typography>
                      <Typography variant="body2">{selectedSubmission.breed || 'Unknown'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Gender / Age / Size</Typography>
                      <Typography variant="body2">
                        {selectedSubmission.gender} / {selectedSubmission.age} / {selectedSubmission.size}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Description</Typography>
                      <Typography variant="body2">{selectedSubmission.description}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="textSecondary">
                  Contact Information
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">Contact Name</Typography>
                      <Typography variant="body2">{selectedSubmission.contactName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Email</Typography>
                      <Typography variant="body2">{selectedSubmission.contactEmail}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Phone</Typography>
                      <Typography variant="body2">{selectedSubmission.contactPhone}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Location</Typography>
                      <Typography variant="body2">{selectedSubmission.location}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="overline" color="textSecondary">
                  Submission Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    Submitted on {formatDate(selectedSubmission.submittedAt)}
                  </Typography>
                  <Typography variant="body2">
                    Status: {getStatusChip(selectedSubmission.status)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setDetailOpen(false);
              if (selectedSubmission) {
                handleEditOpen(selectedSubmission);
              }
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Update Rescue Request Status</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={editStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="rescued">Rescued</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Notes (Optional)"
            multiline
            rows={4}
            fullWidth
            value={editNotes}
            onChange={handleNotesChange}
            placeholder="Add any additional notes about this rescue case..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSaveStatus} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RescueManagementTab; 