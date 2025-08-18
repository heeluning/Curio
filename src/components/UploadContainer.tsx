'use client'

import React, { useCallback, useState } from 'react'
import { FileModal } from '@/db/schema'
import {useDropzone} from 'react-dropzone'
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import axios from 'axios'


type Props = {}


const UploadContainer = (props: Props) => {

    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [noteText, setNoteText] = useState('');


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
    // Update notes mutation
    const {mutate: updateNotes, isPending: isUpdatingNotes }= useMutation({
        mutationFn: ({ fileId, note }: { fileId: number, note: string }) => {
            return axios.post('/api/update-file-note', { fileId, note })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] })
            setEditingNoteId(null);
            setNoteText('');
        },
    })

    const onDrop = useCallback((acceptedFiles: File[]) => {
        mutate(acceptedFiles[0])
      }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    
    const handleEditNote = (file: FileModal) => {
        setEditingNoteId(file.id);
        setNoteText(file.notes || '');
    }

    const handleSaveNote = (fileId: number) => {
        updateNotes({ fileId, note: noteText });
    }

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setNoteText('');
    }


    

    return (
        <div className='h-full w-full flex flex-col'>
            <div className='flex-1 overflow-y-auto p-4'>
                {isLoading ? 
                    (<p className='text-center text-sm text-gray-500 p-2'>Loading...</p> 
                    ):(
                    files?.data.map((file: FileModal) => (
                        <div>
                        <p key={file.id} className='text-center text-sm p-2'>
                            {file.file_name}
                        </p>
                        </div>
                    )))
                }
            </div>


            <div className='flex-shrink-0 p-2'>
                <div {...getRootProps()}
                className='border-2 border-dashed 
                border-gray-300 rounded-lg p-4 h-20 
                w-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors'>
                <input {...getInputProps()} />
                {
                    isPending ? <p>Uploading...</p> :
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
                }
                </div>
            </div>
        </div>
    )
    }

export default UploadContainer