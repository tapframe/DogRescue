import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetsIcon from '@mui/icons-material/Pets';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningIcon from '@mui/icons-material/Warning';

const ResourcesPage = () => {
  const resourceCategories = [
    {
      title: 'Dog Training',
      icon: <SchoolIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Resources for training your new dog, from basic commands to behavioral issues.',
    },
    {
      title: 'Healthcare',
      icon: <MedicalServicesIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Information on routine care, vaccinations, and common health issues.',
    },
    {
      title: 'Nutrition',
      icon: <RestaurantIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1551730459-8ad3f829611a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Guidance on proper feeding, diet requirements, and healthy treats.',
    },
    {
      title: 'Behavior',
      icon: <PsychologyIcon fontSize="large" />,
      image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Understanding dog behavior, body language, and addressing common issues.',
    },
  ];

  const faqs = [
    {
      question: 'How do I introduce my new dog to my existing pets?',
      answer: 'Introduce pets gradually in a neutral environment. Start with scent introduction, then visual contact with a barrier, and finally supervised direct interaction. Keep the first meetings short and positive. Always monitor interactions until you\'re confident they get along well. Consider consulting a professional trainer if you encounter difficulties.'
    },
    {
      question: 'What should I feed my dog?',
      answer: 'Feed a high-quality commercial dog food appropriate for your dog\'s age, size, and health needs. Look for products that list a specific meat as the first ingredient and avoid those with excessive fillers or by-products. Consult your vet for specific recommendations, especially for dogs with health issues or special dietary needs.'
    },
    {
      question: 'How often should my dog see a veterinarian?',
      answer: 'Adult dogs should have a wellness check-up at least once a year. Puppies require more frequent visits for vaccinations and monitoring development. Senior dogs (typically over 7 years) benefit from twice-yearly check-ups. Always see a vet promptly if your dog shows signs of illness or injury.'
    },
    {
      question: 'How can I help my dog adjust to a new home?',
      answer: 'Create a consistent routine for feeding, walks, and bedtime. Provide a quiet space with their bed and toys. Be patient as they learn house rules. Use positive reinforcement for desired behaviors. Limit introductions to new people and pets initially. Give your dog time to decompress and adjust to their new environment - this can take weeks or even months.'
    },
    {
      question: 'What are signs that my dog needs immediate veterinary attention?',
      answer: 'Seek emergency care if your dog shows: difficulty breathing, prolonged seizures, suspected poisoning, severe injury or bleeding, inability to urinate, persistent vomiting or diarrhea, extreme lethargy, collapse, or signs of severe pain. When in doubt, call your vet or an emergency animal hospital for guidance.'
    },
  ];

  const emergencyContacts = [
    {
      name: 'Pet Poison Helpline',
      phone: '(855) 764-7661',
      description: '24/7 animal poison control service (fee may apply)'
    },
    {
      name: 'ASPCA Animal Poison Control',
      phone: '(888) 426-4435',
      description: '24/7 poison control hotline (fee may apply)'
    },
    {
      name: 'City Animal Emergency Hospital',
      phone: '(123) 456-7890',
      description: '24-hour emergency veterinary care'
    },
    {
      name: 'Dog Rescue Mission Helpline',
      phone: '(123) 456-7000',
      description: 'For questions about your adopted dog (business hours only)'
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Dog Care Resources
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Find helpful information, guides, and resources to ensure your dog lives a happy and healthy life.
        </Typography>

        {/* Resource Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Pet Care Topics
          </Typography>
          <Grid container spacing={4}>
            {resourceCategories.map((category, index) => (
              <Grid item={true} key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={category.image}
                    alt={category.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 1, color: 'primary.main' }}>
                        {category.icon}
                      </Box>
                      <Typography variant="h6" component="div">
                        {category.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQs */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Emergency Contacts */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2 }}>
            Emergency Contacts
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Keep these numbers handy in case of a pet emergency. When in doubt, always contact a veterinarian.
          </Typography>
          <Grid container spacing={3}>
            <Grid item={true} xs={12} md={6}>
              <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      Common Emergency Signs
                    </Typography>
                  </Box>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PetsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Difficulty breathing or choking" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PetsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Severe bleeding or trauma" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PetsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Ingestion of toxic substances" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PetsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Seizures or collapse" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PetsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Inability to urinate or defecate" />
                    </ListItem>
                  </List>
                  <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                    If your dog shows any of these signs, seek veterinary care immediately!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item={true} xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      Emergency Contact Numbers
                    </Typography>
                  </Box>
                  <List>
                    {emergencyContacts.map((contact, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemText 
                          primary={contact.name} 
                          secondary={contact.description}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                        <Typography variant="body1" color="primary" fontWeight="bold">
                          {contact.phone}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Additional Resources */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Recommended Resources
          </Typography>
          <Grid container spacing={4}>
            <Grid item={true} xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MenuBookIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      Books & Publications
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="The Art of Raising a Puppy" 
                        secondary="by Monks of New Skete"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="How to Be Your Dog's Best Friend" 
                        secondary="by Monks of New Skete"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Inside of a Dog" 
                        secondary="by Alexandra Horowitz"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Don't Shoot the Dog" 
                        secondary="by Karen Pryor"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item={true} xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PsychologyIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      Online Resources
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="American Kennel Club (AKC)" 
                        secondary="Training resources, breed information, and health articles"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="ASPCA Pet Care" 
                        secondary="Comprehensive guides on dog care, behavior, and training"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Whole Dog Journal" 
                        secondary="In-depth articles on natural dog care, training, and nutrition"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Fear Free Happy Homes" 
                        secondary="Resources for reducing fear, anxiety, and stress in pets"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" color="primary" size="large" href="/contact">
              Contact Us for More Resources
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ResourcesPage; 