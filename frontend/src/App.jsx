import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Container } from '@chakra-ui/react';

function App() {
  return (
    <>
      <Navbar />
      <Container maxW="container.xl" mt={4}>
        <Outlet />
      </Container>
    </>
  );
}

export default App;