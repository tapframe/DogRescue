import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
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
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  FormHelperText,
  SelectChangeEvent,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { dogApi, DogData, volunteerApi, VolunteerData } from '../services/api';

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function for tab accessibility
function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

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

const AdminPage = () => {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // State for dogs list
  const [dogs, setDogs] = useState<DogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for dog dialog
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [currentDogId, setCurrentDogId] = useState('');
  
  // State for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dogToDelete, setDogToDelete] = useState<string | null>(null);
  
  // State for form fields
  const [formData, setFormData] = useState<DogData>({
    name: '',
    breed: '',
    age: '',
    size: '',
    gender: '',
    image: '',
    description: '',
    tags: []
  });
  
  // State for form validation
  const [formErrors, setFormErrors] = useState({
    name: false,
    breed: false,
    age: false,
    size: false,
    gender: false,
    image: false,
    description: false
  });
  
  // State for tag input
  const [tagInput, setTagInput] = useState('');
  
  // State for snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Volunteer states
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
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

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch dogs on component mount
  useEffect(() => {
    fetchDogs();
    fetchVolunteers();
  }, []);
  
  // Fetch all dogs
  const fetchDogs = async () => {
    setLoading(true);
    try {
      const dogsData = await dogApi.getAllDogs();
      setDogs(dogsData);
      setError('');
    } catch (err) {
      console.error('Error fetching dogs:', err);
      setError('Failed to fetch dogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch volunteers
  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const volunteersData = await volunteerApi.getAllVolunteers();
      setVolunteers(volunteersData);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      fetchDogs();
      return;
    }
    
    const filtered = dogs.filter(dog => 
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setDogs(filtered);
  };
  
  // Open dog dialog for add/edit
  const handleOpenDialog = (dog?: DogData) => {
    if (dog) {
      // Edit mode
      setDialogTitle('Edit Dog');
      setIsEdit(true);
      setCurrentDogId(dog._id || '');
      setFormData({
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        size: dog.size,
        gender: dog.gender,
        image: dog.image,
        description: dog.description,
        tags: [...dog.tags]
      });
    } else {
      // Add mode
      setDialogTitle('Add New Dog');
      setIsEdit(false);
      setCurrentDogId('');
      setFormData({
        name: '',
        breed: '',
        age: '',
        size: '',
        gender: '',
        image: '',
        description: '',
        tags: []
      });
    }
    setOpen(true);
  };
  
  // Close dog dialog
  const handleCloseDialog = () => {
    setOpen(false);
    // Reset form errors
    setFormErrors({
      name: false,
      breed: false,
      age: false,
      size: false,
      gender: false,
      image: false,
      description: false
    });
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle select change
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  // Add tag
  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput]
      });
      setTagInput('');
    }
  };
  
  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {
      name: !formData.name,
      breed: !formData.breed,
      age: !formData.age,
      size: !formData.size,
      gender: !formData.gender,
      image: !formData.image,
      description: !formData.description
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (isEdit) {
        // Update existing dog
        await dogApi.updateDog(currentDogId, formData);
        setSnackbarMessage('Dog updated successfully!');
      } else {
        // Add new dog
        await dogApi.createDog(formData);
        setSnackbarMessage('New dog added successfully!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
      fetchDogs();
    } catch (err) {
      console.error('Error saving dog:', err);
      setSnackbarMessage('Failed to save dog. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Open delete confirmation
  const handleDeleteOpen = (id: string) => {
    setDogToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Close delete confirmation
  const handleDeleteClose = () => {
    setDeleteConfirmOpen(false);
    setDogToDelete(null);
  };
  
  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!dogToDelete) return;
    
    setLoading(true);
    try {
      await dogApi.deleteDog(dogToDelete);
      setSnackbarMessage('Dog deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchDogs();
    } catch (err) {
      console.error('Error deleting dog:', err);
      setSnackbarMessage('Failed to delete dog. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      handleDeleteClose();
    }
  };
  
  // Handle pagination change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // VOLUNTEER MANAGEMENT FUNCTIONS

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
        setSnackbarMessage('Volunteer updated successfully!');
      } else {
        // Add new volunteer
        await volunteerApi.createVolunteer(volunteerFormData);
        setSnackbarMessage('New volunteer added successfully!');
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleVolunteerCloseDialog();
      fetchVolunteers();
    } catch (err) {
      console.error('Error saving volunteer:', err);
      setSnackbarMessage('Failed to save volunteer. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
      setSnackbarMessage('Volunteer deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchVolunteers();
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      setSnackbarMessage('Failed to delete volunteer. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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

  // Let's first add a new function to handle status updates
  const handleUpdateVolunteerStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await volunteerApi.updateVolunteerStatus(id, status);
      setSnackbarMessage(`Volunteer ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchVolunteers();
    } catch (err) {
      console.error(`Error updating volunteer status:`, err);
      setSnackbarMessage('Failed to update volunteer status. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin dashboard tabs"
          >
            <Tab 
              label="Dog Management" 
              icon={<PetsIcon />} 
              iconPosition="start" 
              {...a11yProps(0)} 
            />
            <Tab 
              label="Volunteer Management" 
              icon={<VolunteerActivismIcon />} 
              iconPosition="start" 
              {...a11yProps(1)} 
            />
          </Tabs>
        </Box>
        
        {/* Dogs Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Search and Add Bar */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search dogs"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />} 
                onClick={fetchDogs}
                sx={{ mr: 2 }}
              >
                Refresh
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpenDialog()}
              >
                Add New Dog
              </Button>
            </Grid>
          </Grid>
          
          {/* Dogs Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Breed</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && dogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Alert severity="error">{error}</Alert>
                      </TableCell>
                    </TableRow>
                  ) : dogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No dogs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dogs
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((dog) => (
                        <TableRow key={dog._id || dog.id}>
                          <TableCell>
                            {dog.image ? (
                              <Box
                                component="img"
                                src={dog.image}
                                alt={dog.name}
                                sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                              />
                            ) : (
                              'No image'
                            )}
                          </TableCell>
                          <TableCell>{dog.name}</TableCell>
                          <TableCell>{dog.breed}</TableCell>
                          <TableCell>{dog.age}</TableCell>
                          <TableCell>{dog.size}</TableCell>
                          <TableCell>{dog.gender}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {dog.tags.slice(0, 2).map((tag: string, index: number) => (
                                <Chip key={index} label={tag} size="small" />
                              ))}
                              {dog.tags.length > 2 && (
                                <Chip label={`+${dog.tags.length - 2}`} size="small" variant="outlined" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpenDialog(dog)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteOpen(dog._id || '')}
                            >
                              <DeleteIcon />
                            </IconButton>
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
              count={dogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </TabPanel>
        
        {/* Volunteers Tab */}
        <TabPanel value={tabValue} index={1}>
          {/* Search and Add Bar */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search volunteers"
                variant="outlined"
                value={volunteerSearchTerm}
                onChange={(e) => setVolunteerSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleVolunteerSearch}>
                      <SearchIcon />
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />} 
                onClick={fetchVolunteers}
                sx={{ mr: 2 }}
              >
                Refresh
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleVolunteerOpenDialog()}
              >
                Add New Volunteer
              </Button>
            </Grid>
          </Grid>
          
          {/* Volunteers Table */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Volunteer Type</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && volunteers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : volunteers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No volunteers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    volunteers
                      .slice(volunteerPage * volunteerRowsPerPage, volunteerPage * volunteerRowsPerPage + volunteerRowsPerPage)
                      .map((volunteer) => (
                        <TableRow key={volunteer._id || volunteer.id}>
                          <TableCell>{volunteer.name}</TableCell>
                          <TableCell>{volunteer.email}</TableCell>
                          <TableCell>{volunteer.phone}</TableCell>
                          <TableCell>{volunteer.volunteerType}</TableCell>
                          <TableCell>{volunteer.availability}</TableCell>
                          <TableCell>
                            <Chip 
                              label={volunteer.status} 
                              color={
                                volunteer.status === 'approved' ? 'success' : 
                                volunteer.status === 'rejected' ? 'error' : 
                                'default'
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
                                <IconButton 
                                  color="success" 
                                  onClick={() => handleUpdateVolunteerStatus(volunteer._id || volunteer.id?.toString() || '', 'approved')}
                                  title="Approve"
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleUpdateVolunteerStatus(volunteer._id || volunteer.id?.toString() || '', 'rejected')}
                                  title="Reject"
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </>
                            )}
                            <IconButton 
                              color="primary" 
                              onClick={() => handleVolunteerOpenDialog(volunteer)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleVolunteerDeleteOpen(volunteer._id || volunteer.id?.toString() || '')}
                            >
                              <DeleteIcon />
                            </IconButton>
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
          </Paper>
        </TabPanel>
        
        {/* Add/Edit Dog Dialog */}
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  helperText={formErrors.name ? 'Name is required' : ''}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  error={formErrors.breed}
                  helperText={formErrors.breed ? 'Breed is required' : ''}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  error={formErrors.age}
                  helperText={formErrors.age ? 'Age is required' : ''}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formErrors.size} required>
                  <InputLabel>Size</InputLabel>
                  <Select
                    name="size"
                    value={formData.size}
                    onChange={handleSelectChange}
                    label="Size"
                  >
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                  </Select>
                  {formErrors.size && <FormHelperText>Size is required</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={formErrors.gender} required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleSelectChange}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                  {formErrors.gender && <FormHelperText>Gender is required</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  error={formErrors.image}
                  helperText={formErrors.image ? 'Image URL is required' : 'Direct link to dog image'}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={formErrors.description}
                  helperText={formErrors.description ? 'Description is required' : ''}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {formData.tags.map((tag: string, index: number) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label="Add a tag"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="outlined" 
                      onClick={handleAddTag}
                      sx={{ height: '100%' }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Add/Edit Volunteer Dialog */}
        <Dialog open={volunteerOpen} onClose={handleVolunteerCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{volunteerDialogTitle}</DialogTitle>
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={volunteerFormErrors.volunteerType} required>
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
                <FormControl fullWidth error={volunteerFormErrors.availability} required>
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
                <FormControl fullWidth>
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
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVolunteerCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleVolunteerSubmit} 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog - Dogs */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteClose}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this dog? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog - Volunteers */}
        <Dialog
          open={volunteerDeleteConfirmOpen}
          onClose={handleVolunteerDeleteClose}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this volunteer? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVolunteerDeleteClose}>Cancel</Button>
            <Button 
              onClick={handleVolunteerDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default AdminPage; 