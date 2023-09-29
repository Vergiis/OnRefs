import { NavBar } from './NavBar';
import { CanvasAdd } from './CanvasAdd';
import { Container } from 'react-bootstrap';
import Canvas from './Canvas';
import { CookiesProvider } from 'react-cookie';

export function Home() {
  return (
    <>
      <CookiesProvider>
        <Container>
          <NavBar />
          <CanvasAdd />
        </Container>
        <Canvas />
      </CookiesProvider>
    </>
  );
}
