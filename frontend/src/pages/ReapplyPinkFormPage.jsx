import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import Select from 'react-select';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading, Text, Grid, GridItem, useToast
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

const periodOptions = [
  { value: 'Period7_00AM', label: '7:00 AM' },
  { value: 'Period8_00AM', label: '8:00 AM' },
  { value: 'Period9_45AM', label: '9:45 AM' },
  { value: 'Period10_45AM', label: '10:45 AM' },
  { value: 'Period11_45AM', label: '11:45 AM' },
  { value: 'Period1_45PM', label: '1:45 PM' },
  { value: 'Period2_45PM', label: '2:45 PM' },
];

function ReapplyPinkFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const { id: formId } = useParams();

  const [organization, setOrganization] = useState('');
  const [venue, setVenue] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOldFormData = async () => {
      try {
        const oldForm = await formService.getFormById(formId);
        // Pre-fill the state
        setOrganization(oldForm.formData.organization);
        setVenue(oldForm.formData.venue);
        setDateFrom(oldForm.formData.dateFrom.split('T')[0]);
        setDateTo(oldForm.formData.dateTo.split('T')[0]);
        const prefilledStudents = oldForm.formData.students.map(student => ({
          ...student,
          periodsMissed: (student.periodsMissed || []).map(p => periodOptions.find(opt => opt.value === p)).filter(Boolean)
        }));
        setStudents(prefilledStudents);
      } catch (error) {
        toast({ title: 'Could not load form data', status: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOldFormData();
  }, [formId, toast]);
  
  // All handler functions (handleStudentChange, addStudentRow, parseFile, etc.) are the same as PinkFormPage
  const handleStudentTextChange = (index, event) => {
    const values = [...students];
    values[index][event.target.name] = event.target.value;
    setStudents(values);
  };
  const handlePeriodChange = (index, selectedOptions) => {
    const values = [...students];
    values[index].periodsMissed = selectedOptions;
    setStudents(values);
  };
  const addStudentRow = () => {
    setStudents([...students, { regNo: '', studentName: '', className: '', periodsMissed: [] }]);
  };
  const removeStudentRow = (index) => {
    const values = [...students];
    values.splice(index, 1);
    setStudents(values);
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const parseFile = () => { /* ... */ };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Pink',
        formData: {
          organization,
          venue,
          dateFrom,
          dateTo,
          students: students.map(s => ({
            ...s,
            periodsMissed: s.periodsMissed.map(p => p.value)
          })),
        },
      };
      await formService.createForm(newFormData);
      toast({ title: 'Form Re-submitted', status: 'success' });
      window.location.href = '/';
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error' });
    }
  };

  if (isLoading) {
    return <Text>Loading form data...</Text>;
  }

  return (
    <Box as="form" onSubmit={onSubmit} p={10} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="1200px" mx="auto" bg="pink.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Re-apply: Pink Form
        </Heading>
        {/* The rest of the form's JSX is identical to PinkFormPage.jsx and will be pre-filled */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}><FormControl isRequired><FormLabel>Organization:</FormLabel><Input variant="flushed" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} /></FormControl></GridItem>
          <GridItem colSpan={2}><FormControl isRequired><FormLabel>Venue:</FormLabel><Input variant="flushed" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} /></FormControl></GridItem>
          <GridItem><FormControl isRequired><FormLabel>Date From:</FormLabel><Input variant="flushed" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></FormControl></GridItem>
          <GridItem><FormControl isRequired><FormLabel>Date To:</FormLabel><Input variant="flushed" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></FormControl></GridItem>
        </Grid>
        <VStack spacing={2} align="stretch">
          <Heading as="h3" size="md" mt={4} borderBottomWidth="1px" pb={2}>Student List</Heading>
          {students.map((student, index) => (
             <Grid key={index} templateColumns="1fr 2fr 1fr 3fr 1fr" gap={4} alignItems="center">
                <Input variant="flushed" placeholder="Reg No" name="regNo" value={student.regNo} onChange={(e) => handleStudentTextChange(index, e)} />
                <Input variant="flushed" placeholder="Student Name" name="studentName" value={student.studentName} onChange={(e) => handleStudentTextChange(index, e)} />
                <Input variant="flushed" placeholder="Class Name" name="className" value={student.className} onChange={(e) => handleStudentTextChange(index, e)} />
                <Select
                  isMulti
                  options={periodOptions}
                  value={student.periodsMissed}
                  onChange={(selected) => handlePeriodChange(index, selected)}
                  placeholder="Select Periods Missed..."
                />
                <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeStudentRow(index)}>Remove</Button>
            </Grid>
          ))}
          <Button size="sm" onClick={addStudentRow} alignSelf="flex-start" mt={2}>Add Student</Button>
        </VStack>
        <Button type="submit" colorScheme="brand" mt={6}>Submit Form</Button>
      </VStack>
    </Box>
  );
}

export default ReapplyPinkFormPage;