'use client'

import { useUser } from '@clerk/nextjs';
import { storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import {v4 as uuidv4} from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { generateDocs } from '@/lib/langchain';
import { generateEmbeddings } from '@/actions/generateEmbeddings';


export enum StatusText{
    UPLOADING = "Uploading file...",
    UPLOADED = "File uploaded successfully",
    SAVING = "Saving file to database....",
    GENERATING = "Generating AI Embeddings, This will only take a few seconds "
}

export type Status = StatusText[keyof StatusText]

const useUpload = () => {
    const [progress, setProgress] = useState<number | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [status, setStatus] = useState<Status | null>(null);
    const {user} = useUser()
    const router = useRouter();

    const handleUpload = async (file:File) => {
        if(!file || !user){
            return;
        }

        //TODO Free/Pro limitations....
        const fileIdToUploadTo = uuidv4();

        const storageRef = ref(storage,
            `users/${user.id}/files/${fileIdToUploadTo}`
        )

        const uploadTask  = uploadBytesResumable(storageRef, file)
        uploadTask.on("state_changed", (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

            setStatus(StatusText.UPLOADING);

            setProgress(percent);

        }, (error) => {
            console.error("Error in uploading the file",error)
        }, async () => {

            setStatus(StatusText.UPLOADED);

            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setStatus(StatusText.SAVING)

            await setDoc(doc(db, "users", user.id,'files', fileIdToUploadTo),{

                name:file.name,
                size:file.size,
                type: file.type,
                downloadUrl: downloadUrl,
                ref: uploadTask.snapshot.ref.fullPath, 
                createdAt: new Date()

            })

            setStatus(StatusText.GENERATING)
            //Generating AI Embeddings
            await generateEmbeddings(fileIdToUploadTo);
            
            setFileId(fileIdToUploadTo);

        })

      
    }
    return {progress, status, fileId, handleUpload}
}

export default useUpload
