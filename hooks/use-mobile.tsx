"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the screen is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on load
    checkMobile()

    // Add listener for resize events
    window.addEventListener("resize", checkMobile)

    // Clean up listener on unmount
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
