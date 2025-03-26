import React from 'react'
import Link from 'next/link'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { FilePlus2 } from 'lucide-react'

const Header = () => {
  return (
    <div className='flex justify-between bg-white shadow-sm p-5 border-6'>
     
     <Link href='dashboard' className='text-2xl' >
     Chat to <span className='text-indigo-700'>PDF</span>
     
     </Link>

     <SignedIn>
        <div className='flex items-center space-x-2'>
          <Button asChild variant="link" className='hidden md:flex'>
            <Link href="/dashboard/upgrade" className="text-white">Pricing</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard" >My Documents</Link>
          </Button>

          <Button asChild variant="outline" className='border-indigo-700'>
            <Link href="/dashboard/upload" >
            <FilePlus2 className='text-indigo-700'/>
            
            </Link>
          </Button>
            {/* upgrade button */}
            <UserButton/>
        </div>
     </SignedIn>
    </div>
  )
}

export default Header
