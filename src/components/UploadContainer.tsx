'use client'

import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'


type Props = {}

const UploadContainer = (props: Props) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        mutation.mutate(acceptedFiles[0])
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    // Mutations
    const mutation = useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return axios.post('/api/upload', formData)
        },
        onSuccess: () => {
        // Invalidate and refetch
        // queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
    })



    return (
    <div className='h-full w-full flex flex-col items-center justify-end p-2'>
        <div {...getRootProps()}
        className='border-2 border-dashed border-gray-300 rounded-lg p-2 h-20 w-full flex flex-col items-center justify-center'>
        <input {...getInputProps()} />
        {
            isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
        </div>
    </div>
    )
    }

export default UploadContainer