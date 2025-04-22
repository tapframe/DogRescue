import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const DonatePage = () => {
  // Donation form state
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honorOf, setHonorOf] = useState('');
  const [message, setMessage] = useState('');
  
  // Payment simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationError, setDonationError] = useState(false);

  const handleAmountChange = (event: SelectChangeEvent) => {
    setAmount(event.target.value as string);
    if (event.target.value !== 'custom') {
      setCustomAmount('');
    }
  };

  const handleDonationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonationType(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setDonationSuccess(true);
      
      // Reset form
      setAmount('');
      setCustomAmount('');
      setDonationType('one-time');
      setName('');
      setEmail('');
      setHonorOf('');
      setMessage('');
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setDonationSuccess(false);
    setDonationError(false);
  };

  // Impact information
  const impactItems = [
    {
      icon: <MedicalServicesIcon fontSize="large" />,
      title: 'Medical Care',
      description: 'Provides vaccinations, spay/neuter surgeries, and treatments for dogs in need.',
      amount: '$50',
    },
    {
      icon: <HomeIcon fontSize="large" />,
      title: 'Shelter',
      description: 'Gives dogs a safe and comfortable place to stay while waiting for their forever homes.',
      amount: '$100',
    },
    {
      icon: <PetsIcon fontSize="large" />,
      title: 'Food & Supplies',
      description: 'Ensures our dogs have nutritious food, beds, toys, and other necessities.',
      amount: '$25',
    },
    {
      icon: <FavoriteIcon fontSize="large" />,
      title: 'Rescue Operations',
      description: 'Supports rescue missions, transport, and emergency care for dogs in dire situations.',
      amount: '$200',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Support Our Mission
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Your donation directly helps us rescue, rehabilitate, and rehome dogs in need.
          Every contribution makes a difference in the life of a dog waiting for their forever home.
        </Typography>

        {/* How Your Donation Helps */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            How Your Donation Helps
          </Typography>
          <Grid container spacing={3}>
            {impactItems.map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" component="div" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                      {item.amount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Donation Form */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                Make a Donation
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Donation Amount */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="amount-label">Select Amount</InputLabel>
                      <Select
                        labelId="amount-label"
                        value={amount}
                        onChange={handleAmountChange}
                        label="Select Amount"
                        required
                      >
                        <MenuItem value="25">$25</MenuItem>
                        <MenuItem value="50">$50</MenuItem>
                        <MenuItem value="100">$100</MenuItem>
                        <MenuItem value="200">$200</MenuItem>
                        <MenuItem value="custom">Custom Amount</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Custom Amount */}
                  {amount === 'custom' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Enter Custom Amount"
                        type="number"
                        InputProps={{ inputProps: { min: 1 } }}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        required
                      />
                    </Grid>
                  )}

                  {/* Donation Type */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Donation Type
                    </Typography>
                    <RadioGroup
                      row
                      value={donationType}
                      onChange={handleDonationTypeChange}
                    >
                      <FormControlLabel value="one-time" control={<Radio />} label="One-time" />
                      <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                    </RadioGroup>
                  </Grid>

                  {/* Personal Information */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Grid>

                  {/* Donation Options */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="In Honor Of (Optional)"
                      value={honorOf}
                      onChange={(e) => setHonorOf(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message (Optional)"
                      multiline
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={isProcessing || (amount === 'custom' && !customAmount)}
                      sx={{ mt: 2, py: 1.5 }}
                      startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <FavoriteIcon />}
                    >
                      {isProcessing ? 'Processing...' : 'Donate Now'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Donation Info */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 2, bgcolor: 'primary.light', color: 'white', height: '100%' }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 3 }}>
                Your Impact
              </Typography>
              <Typography variant="body1" paragraph>
                Every donation, no matter the size, makes a difference in the lives of dogs in need. 
                Your generosity helps us:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>Rescue dogs from high-kill shelters and dangerous situations</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Provide medical care, including vaccinations and surgeries</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Feed, shelter, and care for dogs while they await adoption</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Train and socialize dogs to prepare them for their forever homes</Typography>
                <Typography component="li" sx={{ mb: 3 }}>Educate the community about responsible pet ownership</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                Your donation is tax-deductible. We'll send you a receipt for your records.
              </Typography>
              <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
                "The greatness of a nation and its moral progress can be judged by the way its animals are treated." - Mahatma Gandhi
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Success/Error Notifications */}
        <Snackbar open={donationSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Thank you for your generous donation! Your support helps us save more dogs.
          </Alert>
        </Snackbar>
        <Snackbar open={donationError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            There was an error processing your donation. Please try again.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default DonatePage; 