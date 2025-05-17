import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilUser,
  cilList,
  cilAccountLogout,
  cilSpeedometer,
  cilPeople, // using this icon for Teachers section
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Main Navigation',
  },
  {
    component: CNavItem,
    name: 'Home',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add Admin',
    to: '/admin/add',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/reports',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },

  // 🔽 Teachers section
  {
    component: CNavTitle,
    name: 'Teachers',
  },
  {
    component: CNavItem,
    name: 'Teacher List',
    to: '/teachers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Verify Teacher',
    to: '/teachers/verify',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

export default _nav
