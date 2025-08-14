'use client'

import React, { useCallback } from 'react'
import { FileModal } from '@/db/schema'
import {useDropzone} from 'react-dropzone'
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import axios from 'axios'


type Props = {}


const UploadContainer = (props: Props) => {

    const queryClient = useQueryClient()
    const {data:files,isLoading} = useQuery({ queryKey: ['files'], queryFn: () =>{
        return axios.post('/api/get-files')
    } })

    // Mutations
    const {mutate, isPending }= useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return axios.post('/api/upload', formData)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['files'] })
        },
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        mutate(acceptedFiles[0])
      }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


    return (
    <div className='h-full w-full flex flex-col items-center justify-start p-2'>

        
        <div {...getRootProps()}
        className='border-2 border-dashed border-gray-300 rounded-lg p-2 h-20 w-full flex flex-col items-center justify-center'>
        <input {...getInputProps()} />
        {
            isPending ? <p>Uploading...</p> :
            isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
        </div>

        
        {
            isLoading ? <p className='text-center text-sm text-gray-500  p-2'>Loading...</p> :
            files?.data.map((file: FileModal) => (
                <p key={file.id}
                className='text-center text-sm justify-start p-2'>{file.file_name}</p>
            ))

        }
    </div>
    )
    }

export default UploadContainer