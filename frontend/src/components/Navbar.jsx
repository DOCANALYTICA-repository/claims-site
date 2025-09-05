import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Button, Link, Heading } from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="gray.100" px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link as={RouterLink} to="/">
            <Heading size="md">Claims Portal</Heading>
          </Link>
        </Box>

        <Flex alignItems={'center'}>
          {user ? (
            <Button colorScheme="teal" variant="solid" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Link as={RouterLink} to="/login">
              <Button colorScheme="teal" variant="ghost">Login</Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;