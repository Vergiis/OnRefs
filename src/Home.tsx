import { NavBar } from './NavBar';
import { CanvasAdd } from './CanvasAdd';
import { Container } from 'react-bootstrap';
import Canvas from './Canvas';
import { CookiesProvider } from 'react-cookie';
import { ContextMenu } from './ContextMenu';
import { useState } from 'react';
import { PageNotifications } from './PageNotifications';
import { TextAdd } from './TextAdd';

export function Home() {
  const [seed, setSeed] = useState(1);
  const reset = () => {
    setSeed(Math.random());
  };

  const [contextShow, setContextShow] = useState(false);
  const showContext = () => {
    setContextShow(true);
  };
  const hideContext = () => {
    setContextShow(false);
  };

  const [contextDelete, setContextDelete] = useState(false);
  const contextDeleteClick = () => {
    setContextDelete(true);
  };
  const endContextDelete = () => {
    setContextDelete(false);
  };

  const [contextResize, setContextResize] = useState(false);
  const contextResizeClick = () => {
    setContextResize(true);
  };
  const endContextResize = () => {
    setContextResize(false);
  };

  const [contextCopyURL, setContextCopyURL] = useState(false);
  const contextCopyURLClick = () => {
    setContextCopyURL(true);
  };
  const endContextCopyURL = () => {
    setContextCopyURL(false);
  };

  const [modalAddImage, SetModalAddImage] = useState('');
  const modalAddImageClick = (val: any) => {
    SetModalAddImage(val);
  };
  const modalAddImageEnd = () => {
    SetModalAddImage('');
  };
  return (
    <>
      <CookiesProvider>
        <Container>
          <NavBar key={seed} />
          <CanvasAdd modalAddImageClick={modalAddImageClick} />
          <TextAdd />
          <PageNotifications />
        </Container>
        <Canvas
          showDropdown={showContext}
          hideDropdown={hideContext}
          contextDelete={contextDelete}
          endContextDelete={endContextDelete}
          contextResize={contextResize}
          contextCopyURL={contextCopyURL}
          endContextResize={endContextResize}
          endContextCopyURL={endContextCopyURL}
          resetNavBar={reset}
          modalAddImageClick={modalAddImageClick}
          modalAddImageStatus={modalAddImage}
          modalAddImageEnd={modalAddImageEnd}
        />
        <ContextMenu
          show={contextShow}
          showDropdown={showContext}
          hideDropdown={hideContext}
          contextDelete={contextDeleteClick}
          contextResize={contextResizeClick}
          contextCopyURL={contextCopyURLClick}
        />
      </CookiesProvider>
    </>
  );
}
