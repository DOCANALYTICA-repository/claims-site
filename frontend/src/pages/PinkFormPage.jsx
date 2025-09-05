import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading, Grid, GridItem, useToast
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';
import formService from '../services/formService';

function PinkFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [organization, setOrganization] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([{ regNo: '', studentName: '', className: '' }]);

  const handleStudentChange = (index, event) => {
    const values = [...students];
    values[index][event.target.name] = event.target.value;
    setStudents(values);
  };

  const addStudentRow = () => {
    setStudents([...students, { regNo: '', studentName: '', className: '' }]);
  };

  const removeStudentRow = (index) => {
    const values = [...students];
    values.splice(index, 1);
    setStudents(values);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Pink',
        formData: { organization, venue, date, students },
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
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Venue:</FormLabel>
              <Input variant="flushed" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Date:</FormLabel>
              <Input variant="flushed" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormControl>
          </GridItem>
        </Grid>

        <VStack spacing={2} align="stretch">
          <Heading as="h3" size="md" mt={4} borderBottomWidth="1px" pb={2}>Students Attending</Heading>
          {students.map((student, index) => (
            <HStack key={index} spacing={2}>
              <Input variant="flushed" placeholder="Reg No" name="regNo" value={student.regNo} onChange={(e) => handleStudentChange(index, e)} />
              <Input variant="flushed" placeholder="Student Name" name="studentName" value={student.studentName} onChange={(e) => handleStudentChange(index, e)} />
              <Input variant="flushed" placeholder="Class Name" name="className" value={student.className} onChange={(e) => handleStudentChange(index, e)} />
              <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeStudentRow(index)}>Remove</Button>
            </HStack>
          ))}
          <Button size="sm" onClick={addStudentRow} alignSelf="flex-start" mt={2}>Add Student</Button>
        </VStack>

        <Button type="submit" colorScheme="brand" mt={6}>Submit Form</Button>
      </VStack>
    </Box>
  );
}

export default PinkFormPage;