import { NavBar } from './NavBar';
import { CanvasAdd } from './CanvasAdd';
import { Container } from 'react-bootstrap';
import Canvas from './Canvas';
import { CookiesProvider } from 'react-cookie';

export function Home() {
  return (
    <>
      <Container>
        <NavBar />
        <CanvasAdd />
      </Container>
      <CookiesProvider>
        <Canvas />
      </CookiesProvider>
    </>
  );
}
