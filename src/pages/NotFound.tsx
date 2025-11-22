import { Link } from 'react-router-dom';
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold">404</h1>
    <Link to="/dashboard" className="text-blue-600">Go Home</Link>
  </div>
);
export default NotFound;