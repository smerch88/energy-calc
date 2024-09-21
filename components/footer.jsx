'use client'

import { useState, useEffect } from 'react'

export function FooterComponent() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear(new Date().getFullYear())
    }, 60000) // Update every minute

    return () => clearInterval(interval);
  }, [])

  return (
    (<footer className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>)
  );
}