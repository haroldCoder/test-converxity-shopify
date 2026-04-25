import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export const Nav = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to={ROUTES.dashboard} className="text-lg font-bold">Dashboard</Link>
        <Link to={ROUTES.affiliates} className="text-lg">Affiliates</Link>
      </div>
    </nav>
  )
}