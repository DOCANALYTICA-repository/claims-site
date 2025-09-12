import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import Select from 'react-select'; // Import react-select
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading, Text, useToast, Grid, GridItem
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

// Define period options
const periodOptions = [
  { value: 'Period7_00AM', label: 'Period 7:00 AM' },
  { value: 'Period8_00AM', label: 'Period 8:00 AM' },
  { value: 'Period9_45AM', label: 'Period 9:45 AM' },
  { value: 'Period10_45AM', label: 'Period 10:45 AM' },
  { value: 'Period11_45AM', label: 'Period 11:45 AM' },
  { value: 'Period1_45PM', label: 'Period 1:45 PM' },
  { value: 'Period2_45PM', label: 'Period 2:45 PM' },
];

function YellowFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [eventName, setEventName] = useState('');
  const [students, setStudents] = useState([{ regNo: '', studentName: '', className: '', periodsMissed: [] }]); // Add periodsMissed to state
  const [file, setFile] = useState(null);

  const handleStudentChange = (index, event) => {
    const values = [...students];
    values[index][event.target.name] = event.target.value;
    setStudents(values);
  };
  
  // New handler for the period multi-select
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

  const parseFile = () => {

    if (!file) return;

    Papa.parse(file, {

      header: true,

      skipEmptyLines: true,

      complete: (results) => {

        // Ensure all fields are present, even if missing from CSV

        const parsedStudents = results.data.map(student => ({

            regNo: student.regNo || '',

            studentName: student.studentName || '',

            className: student.className || '',

            attendanceWithClaims: student.attendanceWithClaims || '',

            attendanceWithoutClaims: student.attendanceWithoutClaims || ''

        }));

        setStudents(parsedStudents);

        toast({ title: 'File Parsed', description: `${results.data.length} students loaded.`, status: 'success', duration: 3000, isClosable: true });

      },

    });

  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Yellow',
        formData: {
          eventName,
          students: students.map(s => ({
              ...s,
              periodsMissed: s.periodsMissed.map(p => p.value) // Extract values for submission
          })),
        },
      };
      await formService.createForm(newFormData, user.token);
      toast({ title: 'Form Submitted', status: 'success', duration: 3000, isClosable: true });
      window.location.href = '/club';
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <Box as="form" onSubmit={onSubmit} p={10} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="1200px" mx="auto" bg="yellow.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Yellow Form: Co-Curricular / Extra Curricular
        </Heading>

        <FormControl isRequired>
          <FormLabel>Event Name:</FormLabel>
          <Input variant="flushed" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </FormControl>

        <Box pt={4}>
          <FormLabel>Upload Student List (CSV)</FormLabel>
          <HStack>
            <Input type="file" accept=".csv" p={1.5} onChange={handleFileChange} />
            <Button onClick={parseFile} disabled={!file} colorScheme="brand">Parse File</Button>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={1}>Headers: regNo, studentName, className</Text>
        </Box>

        <VStack spacing={4} align="stretch">
          <Heading as="h3" size="md" mt={4} borderBottomWidth="1px" pb={2}>Student List</Heading>
          {students.map((student, index) => (
            <Grid key={index} templateColumns="1fr 2fr 1fr 3fr 1fr" gap={4} alignItems="center">
                <Input variant="flushed" placeholder="Reg No" name="regNo" value={student.regNo} onChange={(e) => handleStudentChange(index, e)} />
                <Input variant="flushed" placeholder="Student Name" name="studentName" value={student.studentName} onChange={(e) => handleStudentChange(index, e)} />
                <Input variant="flushed" placeholder="Class Name" name="className" value={student.className} onChange={(e) => handleStudentChange(index, e)} />
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

        <Button type="submit" colorScheme="brand" mt={6} size="lg">Submit Form</Button>
      </VStack>
    </Box>
  );
}

export default YellowFormPage;