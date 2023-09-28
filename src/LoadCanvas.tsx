import { useCookies } from 'react-cookie';
import { Navigate, useSearchParams } from 'react-router-dom';

export function LoadCanvas() {
  const [searchParams] = useSearchParams();

  const [cookies, setCookie] = useCookies(['canvasID']);

  setCookie('canvasID', searchParams.get('canvas'));

  return <Navigate to="/" />;
}
