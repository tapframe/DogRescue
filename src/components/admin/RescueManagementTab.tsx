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
      const prevStatus = editingSubmission.status;
      await rescueApi.updateRescueSubmission(editingSubmission._id as string, {
        status: editStatus,
        statusNotes: editNotes || editingSubmission.statusNotes
      });
      
      // Update local state
      setRescueSubmissions(prev => 
        prev.map(submission => 
          submission._id === editingSubmission._id 
            ? { ...submission, status: editStatus, statusNotes: editNotes || submission.statusNotes } 
            : submission
        )
      );
      
      // Special notification for rescued status
      if (prevStatus !== 'rescued' && editStatus === 'rescued') {
        showNotification('Rescue marked as rescued! Dog has been added to the adoption list.', 'success');
      } else {
        showNotification('Rescue submission status updated successfully', 'success');
      }
      
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
      
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader aria-label="rescue submissions table">
            <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Dog Info</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Submitted By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rescueSubmissions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((submission) => (
                    <TableRow hover key={submission._id || submission.id}>
                      <TableCell>
                        #{submission._id?.toString().slice(-6) || submission.id}
                      </TableCell>
                      <TableCell>
                        <Box>
                        <Typography variant="body2" fontWeight={500}>
                            {submission.name || 'Unknown Dog'}
                        </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {submission.gender}, {submission.age}, {submission.size}
                        </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200, whiteSpace: 'normal' }}>
                            {submission.location}
                          </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {submission.userName || submission.contactName}
                        </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {submission.userEmail || submission.contactEmail}
                        </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {formatDate(submission.submittedAt)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(submission.status)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(submission)}
                              sx={{ 
                                color: theme.palette.info.main,
                                '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.1) }
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
                                color: theme.palette.warning.main,
                                '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          )}
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

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
          Rescue Submission Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Dog Information
                </Typography>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Name</Typography>
                      <Typography variant="body1">{selectedSubmission.name || 'Unknown'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Breed</Typography>
                      <Typography variant="body1">{selectedSubmission.breed || 'Unknown'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Gender</Typography>
                      <Typography variant="body1">{selectedSubmission.gender}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Age</Typography>
                      <Typography variant="body1">{selectedSubmission.age}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Size</Typography>
                      <Typography variant="body1">{selectedSubmission.size}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Submission Information
                </Typography>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Submitted By</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedSubmission.userName || selectedSubmission.contactName}
                        {selectedSubmission.userName && selectedSubmission.userName !== selectedSubmission.contactName && (
                          <Chip 
                            label="Registered User" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                          />
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{selectedSubmission.userEmail || selectedSubmission.contactEmail}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Phone</Typography>
                      <Typography variant="body1">{selectedSubmission.contactPhone}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Date Submitted</Typography>
                      <Typography variant="body1">{formatDate(selectedSubmission.submittedAt)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Status</Typography>
                      <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedSubmission.status)}</Box>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Location Information
                </Typography>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body1">{selectedSubmission.location}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Description
                  </Typography>
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="body1">{selectedSubmission.description}</Typography>
                </Paper>
              </Grid>

              {selectedSubmission.statusNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Status Notes
                  </Typography>
                  <Paper sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                    <Typography variant="body1">{selectedSubmission.statusNotes}</Typography>
                  </Paper>
              </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setDetailOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
          {selectedSubmission && (
            <Button 
            onClick={() => {
              setDetailOpen(false);
                handleEditOpen(selectedSubmission);
            }}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2 }}
          >
            Update Status
          </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Update Rescue Status
          </Typography>
        </DialogTitle>
        <DialogContent>
          {editingSubmission && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" gutterBottom>
                Update the status for rescue submission from {editingSubmission.userName || editingSubmission.contactName}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="status-select-label">Status</InputLabel>
            <Select
                  labelId="status-select-label"
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
                fullWidth
            multiline
            rows={4}
                label="Status Notes (Optional)"
            value={editNotes}
            onChange={handleNotesChange}
                placeholder="Add any notes about this status update"
                sx={{ mt: 3 }}
          />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleEditClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveStatus} 
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Save Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RescueManagementTab; 