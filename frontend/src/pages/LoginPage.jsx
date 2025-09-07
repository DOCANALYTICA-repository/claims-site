import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx'; // Corrected import path

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const toast = useToast();

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      toast({
        title: 'Login Successful.',
        description: `Welcome back, ${user.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // --- CORRECTED REDIRECT LOGIC ---
      // 1. Check for the most specific role first (HOD)
      if (user.role === 'Faculty/Staff' && user.designation === 'HOD') {
        navigate('/hod');
      } 
      // 2. Then, check for any other faculty
      else if (user.role === 'Faculty/Staff') {
        navigate('/teacher');
      } 
      // 3. Then, check for Club
      else if (user.role === 'Club') {
        navigate('/club');
      } 
      // 4. Default to Student dashboard
      else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Login Failed.',
        description: 'Invalid email or password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" h="80vh">
      <Box as="form" onSubmit={onSubmit} p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <Heading>Login</Heading>
          <Text>Please log in to your account</Text>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={email} onChange={onChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={password} onChange={onChange} />
          </FormControl>
          <Button type="submit" colorScheme="brand" width="full"> {/* Use consistent brand color */}
            Login
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default LoginPage;