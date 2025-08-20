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
  Typography,
  SelectChangeEvent,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Stack,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';

import { dogApi, DogData, uploadApi } from '../../services/api';

interface DogManagementTabProps {
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

const DogManagementTab: React.FC<DogManagementTabProps> = ({ showNotification }) => {
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
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch dogs on component mount
  useEffect(() => {
    fetchDogs();
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
        showNotification('Dog updated successfully!', 'success');
      } else {
        // Add new dog
        await dogApi.createDog(formData);
        showNotification('New dog added successfully!', 'success');
      }
      
      handleCloseDialog();
      fetchDogs();
    } catch (err) {
      console.error('Error saving dog:', err);
      showNotification('Failed to save dog. Please try again.', 'error');
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
      showNotification('Dog deleted successfully!', 'success');
      fetchDogs();
    } catch (err) {
      console.error('Error deleting dog:', err);
      showNotification('Failed to delete dog. Please try again.', 'error');
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

  // Stats content for the dashboard cards
  const totalDogs = dogs.length;
  const totalSmallDogs = dogs.filter(dog => dog.size === 'Small').length;
  const totalMediumDogs = dogs.filter(dog => dog.size === 'Medium').length;
  const totalLargeDogs = dogs.filter(dog => dog.size === 'Large').length;

  return (
    <>
      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                TOTAL DOGS
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                {totalDogs}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All dogs in the system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                SMALL DOGS
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                {totalSmallDogs}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Small sized dogs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                MEDIUM DOGS
              </Typography>
              <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                {totalMediumDogs}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Medium sized dogs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)', borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 1 }}>
                LARGE DOGS
              </Typography>
              <Typography variant="h4" color="error.main" sx={{ mb: 1 }}>
                {totalLargeDogs}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Large sized dogs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Add Bar */}
      <Card elevation={0} sx={{ 
        mb: 4, 
        borderRadius: 3, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dogs List
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog()}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Add New Dog
          </Button>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search dogs by name or breed"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  startIcon={<FilterListIcon />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Filter
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />} 
                  onClick={fetchDogs}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Refresh
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Breed</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Age</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Tags</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && dogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={40} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : dogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Box sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No dogs found.
                      </Typography>
                      <Button 
                        variant="text" 
                        color="primary" 
                        sx={{ mt: 1 }}
                        onClick={() => handleOpenDialog()}
                      >
                        Add your first dog
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) :
                dogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dog) => (
                    <TableRow key={dog._id || dog.id} hover>
                      <TableCell>
                        {dog.image ? (
                          <Box
                            component="img"
                            src={dog.image}
                            alt={dog.name}
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              objectFit: 'cover', 
                              borderRadius: 2,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          />
                        ) : (
                          'No image'
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {dog.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{dog.breed}</TableCell>
                      <TableCell>{dog.age}</TableCell>
                      <TableCell>
                        <Chip 
                          label={dog.size} 
                          size="small"
                          color={
                            dog.size === 'Small' ? 'success' :
                            dog.size === 'Medium' ? 'warning' : 'error'
                          }
                          sx={{ borderRadius: 1, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={dog.gender} 
                          size="small"
                          color={dog.gender === 'Male' ? 'info' : 'secondary'}
                          sx={{ borderRadius: 1, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={dog.status || 'Available'} 
                          size="small"
                          color={
                            dog.status === 'adopted' ? 'success' :
                            dog.status === 'fostered' ? 'info' :
                            dog.status === 'pending' ? 'warning' : 'primary'
                          }
                          sx={{ borderRadius: 1, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {dog.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Chip 
                              key={index} 
                              label={tag} 
                              size="small" 
                              sx={{ 
                                borderRadius: 1, 
                                backgroundColor: 'rgba(0,0,0,0.04)', 
                                fontWeight: 500 
                              }} 
                            />
                          ))}
                          {dog.tags.length > 2 && (
                            <Chip 
                              label={`+${dog.tags.length - 2}`} 
                              size="small" 
                              variant="outlined" 
                              sx={{ borderRadius: 1 }} 
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(dog)}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(63, 81, 181, 0.08)', 
                              mr: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteOpen(dog._id || dog.id?.toString() || '')}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(244, 67, 54, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.15)',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              }
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
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        />
      </Card>
      
      {/* Add/Edit Dog Dialog */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            {dialogTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEdit ? 'Update dog information' : 'Add a new dog to the system'}
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
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                helperText={formErrors.name ? 'Name is required' : ''}
                required
                size="small"
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
                size="small"
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
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={formErrors.size} required size="small">
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
              <FormControl fullWidth error={formErrors.gender} required size="small">
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
                helperText={formErrors.image ? 'Image URL is required' : 'Direct link to dog image or upload a file below'}
                required
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setImageFile(file);
                      }
                    }}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {imageFile ? imageFile.name : 'No file selected'}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!imageFile || isUploadingImage}
                  onClick={async () => {
                    if (!imageFile) return;
                    try {
                      setIsUploadingImage(true);
                      const { url } = await uploadApi.uploadImage(imageFile);
                      setFormData({ ...formData, image: url });
                    } catch (err) {
                      console.error('Image upload failed', err);
                      showNotification('Image upload failed. Please try again.', 'error');
                    } finally {
                      setIsUploadingImage(false);
                    }
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  {isUploadingImage ? 'Uploading...' : 'Upload'}
                </Button>
              </Box>
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
                rows={3}
                required
                size="small"
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
                    size="small"
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
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Button 
                    variant="outlined" 
                    onClick={handleAddTag}
                    sx={{ height: '100%' }}
                    size="small"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit" 
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              mr: 1,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Are you sure you want to delete this dog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleDeleteClose} 
            color="inherit" 
            variant="outlined"
            size="medium"
            sx={{ 
              borderRadius: 2, 
              mr: 1,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            size="medium"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DogManagementTab; 