// src/App.js
import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'

import './scss/style.scss'
import './scss/examples.scss'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const authenticatedUser = useSelector((state) => state.auth.authenticatedUser)
  console.log('Authenticated User:', authenticatedUser.token)

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {!authenticatedUser ? (
            <>
              <Route path="/login" name="Login Page" element={<Login />} />
              <Route path="/register" name="Register Page" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/register" element={<Navigate to="/dashboard" replace />} />
              <Route exact path="/404" element={<Page404 />} />
              <Route exact path="/500" element={<Page500 />} />
              <Route path="*" element={<DefaultLayout />} />
            </>
          )}
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
