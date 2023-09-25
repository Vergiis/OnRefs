import { NavBar } from './NavBar';
import { CanvasAdd } from './CanvasAdd';
import { Container } from 'react-bootstrap';
import Canvas from './Canvas';

export function Home() {
  return (
    <>
      <Container>
        <NavBar />
        <CanvasAdd />
      </Container>
      <Canvas />
    </>
  );
}
