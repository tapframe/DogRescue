import React, { useState, useEffect } from 'react';
import {
  Box,
  GridLegacy as Grid,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Chip,
  FormHelperText,
  SelectChangeEvent,
  Card,
  CardContent,
  InputAdornment,
  Typography,
  Divider,
  Stack,
  Tooltip,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';

import { volunteerApi, VolunteerData } from '../../services/api';

// Volunteer options
const volunteerTypes = [
  'Dog Walker',
  'Foster Parent',
  'Event Helper',
  'Kennel Assistant',
  'Other'
];

// Availability options
const availabilityOptions = [
  'Weekdays',
  'Weekends',
  'Evenings',
  'Mornings',
  'Flexible'
];

// Status options
const statusOptions = [
  'pending',
  'approved',
  'rejected'
];

interface VolunteerManagementTabProps {
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

const VolunteerManagementTab: React.FC<VolunteerManagementTabProps> = ({ showNotification }) => {
  // Volunteer states
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [volunteerPage, setVolunteerPage] = useState(0);
  const [volunteerRowsPerPage, setVolunteerRowsPerPage] = useState(10);
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [volunteerDialogTitle, setVolunteerDialogTitle] = useState('');
  const [volunteerIsEdit, setVolunteerIsEdit] = useState(false);
  const [currentVolunteerId, setCurrentVolunteerId] = useState('');
  const [volunteerToDelete, setVolunteerToDelete] = useState<string | null>(null);
  const [volunteerDeleteConfirmOpen, setVolunteerDeleteConfirmOpen] = useState(false);
  const [volunteerSearchTerm, setVolunteerSearchTerm] = useState('');
  const [volunteerFormData, setVolunteerFormData] = useState<VolunteerData>({
    name: '',
    email: '',
    phone: '',
    volunteerType: '',
    availability: '',
    experience: '',
    message: '',
    status: 'pending',
    submittedAt: new Date().toISOString()
  });
  const [volunteerFormErrors, setVolunteerFormErrors] = useState({
    name: false,
    email: false,
    phone: false,
    volunteerType: false,
    availability: false,
    experience: false
  });

  // Fetch volunteers on component mount
  useEffect(() => {
    fetchVolunteers();
  }, []);

  // Fetch volunteers
  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const volunteersData = await volunteerApi.getAllVolunteers();
      setVolunteers(volunteersData);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      showNotification('Failed to fetch volunteers. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle volunteer search
  const handleVolunteerSearch = () => {
    if (!volunteerSearchTerm) {
      fetchVolunteers();
      return;
    }
    
    const filtered = volunteers.filter(volunteer => 
      volunteer.name.toLowerCase().includes(volunteerSearchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(volunteerSearchTerm.toLowerCase()) ||
      volunteer.volunteerType.toLowerCase().includes(volunteerSearchTerm.toLowerCase())
    );
    
    setVolunteers(filtered);
  };

  // Open volunteer dialog for add/edit
  const handleVolunteerOpenDialog = (volunteer?: VolunteerData) => {
    if (volunteer) {
      // Edit mode
      setVolunteerDialogTitle('Edit Volunteer');
      setVolunteerIsEdit(true);
      setCurrentVolunteerId(volunteer._id || volunteer.id?.toString() || '');
      setVolunteerFormData({
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        volunteerType: volunteer.volunteerType,
        availability: volunteer.availability,
        experience: volunteer.experience,
        message: volunteer.message,
        status: volunteer.status,
        submittedAt: volunteer.submittedAt
      });
    } else {
      // Add mode
      setVolunteerDialogTitle('Add New Volunteer');
      setVolunteerIsEdit(false);
      setCurrentVolunteerId('');
      setVolunteerFormData({
        name: '',
        email: '',
        phone: '',
        volunteerType: '',
        availability: '',
        experience: '',
        message: '',
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
    }
    setVolunteerOpen(true);
  };

  // Close volunteer dialog
  const handleVolunteerCloseDialog = () => {
    setVolunteerOpen(false);
    // Reset form errors
    setVolunteerFormErrors({
      name: false,
      email: false,
      phone: false,
      volunteerType: false,
      availability: false,
      experience: false
    });
  };

  // Handle volunteer form input change
  const handleVolunteerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVolunteerFormData({
      ...volunteerFormData,
      [name]: value
    });
  };

  // Handle volunteer select change
  const handleVolunteerSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setVolunteerFormData({
      ...volunteerFormData,
      [name]: value
    });
  };

  // Validate volunteer form
  const validateVolunteerForm = () => {
    const errors = {
      name: !volunteerFormData.name,
      email: !volunteerFormData.email,
      phone: !volunteerFormData.phone,
      volunteerType: !volunteerFormData.volunteerType,
      availability: !volunteerFormData.availability,
      experience: !volunteerFormData.experience
    };
    
    setVolunteerFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Submit volunteer form
  const handleVolunteerSubmit = async () => {
    if (!validateVolunteerForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (volunteerIsEdit) {
        // Update existing volunteer
        await volunteerApi.updateVolunteer(currentVolunteerId, volunteerFormData);
        showNotification('Volunteer updated successfully!', 'success');
      } else {
        // Add new volunteer
        await volunteerApi.createVolunteer(volunteerFormData);
        showNotification('New volunteer added successfully!', 'success');
      }
      
      handleVolunteerCloseDialog();
      fetchVolunteers();
    } catch (err) {
      console.error('Error saving volunteer:', err);
      showNotification('Failed to save volunteer. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open volunteer delete confirmation
  const handleVolunteerDeleteOpen = (id: string) => {
    setVolunteerToDelete(id);
    setVolunteerDeleteConfirmOpen(true);
  };

  // Close volunteer delete confirmation
  const handleVolunteerDeleteClose = () => {
    setVolunteerDeleteConfirmOpen(false);
    setVolunteerToDelete(null);
  };

  // Confirm volunteer delete
  const handleVolunteerDeleteConfirm = async () => {
    if (!volunteerToDelete) return;
    
    setLoading(true);
    try {
      // Delete volunteer
      await volunteerApi.deleteVolunteer(volunteerToDelete);
      showNotification('Volunteer deleted successfully!', 'success');
      fetchVolunteers();
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      showNotification('Failed to delete volunteer. Please try again.', 'error');
    } finally {
      setLoading(false);
      handleVolunteerDeleteClose();
    }
  };

  // Handle volunteer pagination change
  const handleVolunteerChangePage = (event: unknown, newPage: number) => {
    setVolunteerPage(newPage);
  };

  // Handle volunteer rows per page change
  const handleVolunteerChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolunteerRowsPerPage(parseInt(event.target.value, 10));
    setVolunteerPage(0);
  };

  // Update volunteer status
  const handleUpdateVolunteerStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await volunteerApi.updateVolunteerStatus(id, status);
      showNotification(`Volunteer ${status === 'approved' ? 'approved' : 'rejected'} successfully!`, 'success');
      fetchVolunteers();
    } catch (err) {
      console.error(`Error updating volunteer status:`, err);
      showNotification('Failed to update volunteer status. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Stats for dashboard
  const totalVolunteers = volunteers.length;
  const pendingVolunteers = volunteers.filter(vol => vol.status === 'pending').length;
  const approvedVolunteers = volunteers.filter(vol => vol.status === 'approved').length;
  const rejectedVolunteers = volunteers.filter(vol => vol.status === 'rejected').length;

  return (
    <>
      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                TOTAL VOLUNTEERS
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                {totalVolunteers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All volunteers in the system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                PENDING
              </Typography>
              <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                {pendingVolunteers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Awaiting review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                APPROVED
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                {approvedVolunteers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active volunteers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                REJECTED
              </Typography>
              <Typography variant="h4" color="error.main" sx={{ mb: 1 }}>
                {rejectedVolunteers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rejected applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Add Bar */}
      <Card sx={{ mb: 4, boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search volunteers by name or email"
                variant="outlined"
                size="small"
                value={volunteerSearchTerm}
                onChange={(e) => setVolunteerSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVolunteerSearch();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  startIcon={<FilterListIcon />}
                  size="small"
                >
                  Filter
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />} 
                  onClick={fetchVolunteers}
                  size="small"
                >
                  Refresh
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => handleVolunteerOpenDialog()}
                  size="small"
                >
                  Add New Volunteer
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Volunteers Table */}
      <Card sx={{ width: '100%', overflow: 'hidden', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Volunteers List
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Availability</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submitted</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && volunteers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={40} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : volunteers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No volunteers found.
                      </Typography>
                      <Button 
                        variant="text" 
                        color="primary" 
                        sx={{ mt: 1 }}
                        onClick={() => handleVolunteerOpenDialog()}
                      >
                        Add your first volunteer
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                volunteers
                  .slice(volunteerPage * volunteerRowsPerPage, volunteerPage * volunteerRowsPerPage + volunteerRowsPerPage)
                  .map((volunteer) => (
                    <TableRow key={volunteer._id || volunteer.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            bgcolor: volunteer.status === 'approved' ? 'success.light' : 
                                    volunteer.status === 'rejected' ? 'error.light' : 'warning.light',
                            width: 35,
                            height: 35, 
                            mr: 1
                          }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body1" fontWeight="medium">
                            {volunteer.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2">{volunteer.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2">{volunteer.phone}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={volunteer.volunteerType}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{volunteer.availability}</TableCell>
                      <TableCell>
                        <Chip 
                          label={volunteer.status} 
                          color={
                            volunteer.status === 'approved' ? 'success' : 
                            volunteer.status === 'rejected' ? 'error' : 
                            'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(volunteer.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {volunteer.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton 
                                color="success" 
                                onClick={() => handleUpdateVolunteerStatus(volunteer._id || volunteer.id?.toString() || '', 'approved')}
                                size="small"
                                sx={{ mr: 0.5 }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton 
                                color="error" 
                                onClick={() => handleUpdateVolunteerStatus(volunteer._id || volunteer.id?.toString() || '', 'rejected')}
                                size="small"
                                sx={{ mr: 0.5 }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleVolunteerOpenDialog(volunteer)}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleVolunteerDeleteOpen(volunteer._id || volunteer.id?.toString() || '')}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
          count={volunteers.length}
          rowsPerPage={volunteerRowsPerPage}
          page={volunteerPage}
          onPageChange={handleVolunteerChangePage}
          onRowsPerPageChange={handleVolunteerChangeRowsPerPage}
        />
      </Card>
      
      {/* Add/Edit Volunteer Dialog */}
      <Dialog open={volunteerOpen} onClose={handleVolunteerCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="medium">
            {volunteerDialogTitle}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={volunteerFormData.name}
                onChange={handleVolunteerInputChange}
                error={volunteerFormErrors.name}
                helperText={volunteerFormErrors.name ? 'Name is required' : ''}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={volunteerFormData.email}
                onChange={handleVolunteerInputChange}
                error={volunteerFormErrors.email}
                helperText={volunteerFormErrors.email ? 'Email is required' : ''}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={volunteerFormData.phone}
                onChange={handleVolunteerInputChange}
                error={volunteerFormErrors.phone}
                helperText={volunteerFormErrors.phone ? 'Phone is required' : ''}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={volunteerFormErrors.volunteerType} required size="small">
                <InputLabel>Volunteer Type</InputLabel>
                <Select
                  name="volunteerType"
                  value={volunteerFormData.volunteerType}
                  onChange={handleVolunteerSelectChange}
                  label="Volunteer Type"
                >
                  {volunteerTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {volunteerFormErrors.volunteerType && <FormHelperText>Volunteer type is required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={volunteerFormErrors.availability} required size="small">
                <InputLabel>Availability</InputLabel>
                <Select
                  name="availability"
                  value={volunteerFormData.availability}
                  onChange={handleVolunteerSelectChange}
                  label="Availability"
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
                {volunteerFormErrors.availability && <FormHelperText>Availability is required</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={volunteerFormData.status}
                  onChange={handleVolunteerSelectChange}
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                value={volunteerFormData.experience}
                onChange={handleVolunteerInputChange}
                error={volunteerFormErrors.experience}
                helperText={volunteerFormErrors.experience ? 'Experience is required' : ''}
                multiline
                rows={2}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={volunteerFormData.message}
                onChange={handleVolunteerInputChange}
                multiline
                rows={2}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button onClick={handleVolunteerCloseDialog} variant="outlined" size="small">Cancel</Button>
          <Button 
            onClick={handleVolunteerSubmit} 
            variant="contained" 
            disabled={loading}
            size="small"
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={volunteerDeleteConfirmOpen}
        onClose={handleVolunteerDeleteClose}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="medium">
            Confirm Delete
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this volunteer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button onClick={handleVolunteerDeleteClose} variant="outlined" size="small">Cancel</Button>
          <Button 
            onClick={handleVolunteerDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={loading}
            size="small"
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VolunteerManagementTab; 