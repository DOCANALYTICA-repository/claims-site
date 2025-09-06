// ... imports

function PinkFormPage() {
  // ... existing hooks

  const [organization, setOrganization] = useState('');
  const [venue, setVenue] = useState('');
  // NEW: Changed 'date' to 'dateFrom' and 'dateTo'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [students, setStudents] = useState([{ regNo: '', studentName: '', className: '' }]);

  // ... existing handler functions (handleStudentChange, addStudentRow, etc.)

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Pink',
        formData: {
          organization,
          venue,
          dateFrom, // Pass the date range
          dateTo,
          students,
        },
      };
      await formService.createForm(newFormData, user.token);
      toast({ title: 'Form Submitted', status: 'success', duration: 3000, isClosable: true });
      window.location.href = '/';
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <Box as="form" onSubmit={onSubmit} p={10} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="800px" mx="auto" bg="pink.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Pink Form: Placement Leave
        </Heading>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Organization:</FormLabel>
              <Input variant="flushed" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Venue:</FormLabel>
              <Input variant="flushed" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
            </FormControl>
          </GridItem>
          {/* NEW: Date inputs updated for a range */}
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Date From:</FormLabel>
              <Input variant="flushed" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Date To:</FormLabel>
              <Input variant="flushed" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </FormControl>
          </GridItem>
        </Grid>

        {/* ... rest of the form for student list ... */}
      </VStack>
    </Box>
  );
}

export default PinkFormPage;