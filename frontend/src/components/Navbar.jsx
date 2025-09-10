import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Button, Link, Heading } from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  // --- THE FIX: Determine the correct dashboard path based on user role ---
  let homePath = '/'; // Default for students
  if (user) {
    if (user.role === 'Faculty/Staff' && user.designation === 'HOD') {
      homePath = '/hod';
    } else if (user.role === 'Faculty/Staff') {
      homePath = '/teacher';
    } else if (user.role === 'Club') {
      homePath = '/club';
    }
  }
  // --- END OF FIX ---

  return (
    <Box bg="gray.100" px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          {/* Use the dynamic homePath variable */}
          <Link as={RouterLink} to={homePath}>
            <Heading size="md">Claims Portal</Heading>
          </Link>
        </Box>

        <Flex alignItems={'center'}>
          {user ? (
            <Button colorScheme="brand" variant="solid" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Link as={RouterLink} to="/login">
              <Button colorScheme="brand" variant="ghost">
                Login
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;