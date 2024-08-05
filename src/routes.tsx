import { createBrowserRouter } from 'react-router-dom'

import { Detail } from './pages/details'
import { Home } from './pages/home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'detail/:contactId',
    element: <Detail />,
  },
])
