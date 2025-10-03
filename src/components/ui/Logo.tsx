'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
}

export default function Logo({ 
  className = '', 
  width = 40, 
  height = 40,
  showText = true 
}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/unson-os-logo.png"
        alt="Unson OS ロゴ"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {showText && (
        <span className="text-xl font-bold text-gray-900">Unson OS</span>
      )}
    </Link>
  )
}