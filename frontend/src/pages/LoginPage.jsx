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
  Flex, // <-- ADD THIS LINE
  useToast,
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';

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
        duration: 5000,
        isClosable: true,
      });
      if (user.role === 'Faculty/Staff') {
        navigate('/hod');
      } else if (user.role === 'Club') {
        navigate('/club');
      } else if (user.role === 'Faculty/Staff') { // <-- NEW: Catch other faculty
        navigate('/teacher');
      } else {
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
          <Button type="submit" colorScheme="teal" width="full">
            Login
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default LoginPage;