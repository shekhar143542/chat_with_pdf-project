
import PdfView from '@/components/PdfView';
import Chat from '@/components/Chat';
import { adminDb } from '@/firebaseAdmin'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const  ChatToFilePage = async (

    {params: {id}}: {params: {id:string}}
    
) => {

   auth.protect();
   const {userId} = await auth();

   if (!userId) {
     throw new Error("User ID is null");
   }

   const docId = id; // Assuming 'id' is the document ID passed in params
   const firebaseRef = await adminDb
   .collection("users")
   .doc(userId)
   .collection("files")
   .doc(docId)
   .get();

   const url = firebaseRef.data()?.downloadUrl; // Assuming the URL is stored in the document

  return (
    <div className='grid lg:grid-cols-5 h-full overflow-hidden'>
     {/* Right Part */}

     <div className='col-span-5 lg:col-span-2 overflow-y-auto'>
    {/* Chat */}

      <Chat id={id}/>
     </div>

     {/* Left part */}
     <div className='col-span-3 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-700 lg:-order-1 overflow-auto'>
      {/* PDFView */}
      <PdfView url={url}/>
     </div>

    </div>
  )
}

export default ChatToFilePage
