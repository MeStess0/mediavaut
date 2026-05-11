// src/components/Layout.jsx
// Shell that wraps every page: Navbar + Sidebar + main content.
// Uses React Router's <Outlet /> to render the current page.

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <>
      <Navbar />

      <div className="app-content">
        {/* Left sidebar — type filter is managed per-page via URL params */}
        <Sidebar />

        {/* Current page renders here */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
