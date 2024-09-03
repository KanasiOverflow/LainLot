import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cl from './OpenImgDialog.module.css'

export default function OpenImgDialog() {

    const [files, setFiles] = useState([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 5,
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const preview = files.map(file => (
        <div key={file.name}>
            <img
                alt='Preview'
                src={file.preview}
                className={cl.previewImg}
                // Revoke data uri after image is loaded
                onLoad={() => { URL.revokeObjectURL(file.preview) }}
            />
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
        // eslint-disable-next-line
    }, []);

    return (
        <section>
            <div className={cl.dropzone} {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop file here, or click to select file</p>
            </div>
            <aside>
                {preview}
            </aside>
        </section>
    )
};