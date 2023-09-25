import { NavBar } from './NavBar';
import { CanvasAdd } from './CanvasAdd';
import { Container } from 'react-bootstrap';

export function Home() {
  return (
    <Container>
      <NavBar />
      <CanvasAdd />
    </Container>
  );
}
