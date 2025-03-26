'use client'

import React from 'react'
import { Button } from './ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PlaceholderDocument = () => {

    const router = useRouter();

    const handleClick = () => {

        //if the user is in the free tier and if they exceed the file upload limit,push them to upgrade page
        
        router.push('/dashboard/upload')

    }

  return (
    <div>
        <Button onClick={handleClick} className='flex flex-col items-center justify-center *
        w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400'>
            <PlusCircleIcon className='h-16 w-16'/>
      <p>
        Add a Document
      </p>
      </Button>
    </div>
  )
}

export default PlaceholderDocument
