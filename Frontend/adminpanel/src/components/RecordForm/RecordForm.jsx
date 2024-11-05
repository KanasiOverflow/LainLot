import { useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import GeneralButton from '../UI/button/GeneralButton';
import GeneralInput from '../UI/input/GeneralInput';
import OpenImgDialog from '../UI/openImgDialog/OpenImgDialog';
import { ModalContext } from '../../provider/context/ModalProvider';
import cl from './index.module.css'

export default function RecordForm() {
    const {
        mode,
        currentTable,
        addRecord,
        editRecord,
        recordFields,
        oldRecord,
        modifyRecordError,
    } = useContext(ModalContext);

    var submitFormRef = useRef();

    const [validation, setValidation] = useState(undefined);
    const [base64String, setBase64String] = useState("");
    
    //State for images which are used in child component
    const [images, setImages] = useState([]);

    const {
        register,
        setValue,
        handleSubmit,
    } = useForm();

    const handleDataFromChild = async (data) => {
        if (data !== null || data !== undefined) {
            
            let promiseArray = (await Promise.all(data)).map((obj) => obj);
            let base64Buffer = "";
            
            promiseArray.forEach(base64File => {
                base64Buffer += base64File + "|";
            });
            
            setBase64String(base64Buffer);
        }
    };
    
    const onSubmit = (data) => {
        var isValid = true;
        data["photo"] = base64String;
        
        for (var i = 0; i < recordFields.length; i++) {
            if (data[recordFields[i]] === undefined) {
                isValid = false;
                setValidation(recordFields[i]);
                break;
            }
            setValidation(undefined);
        }
        
        if (isValid) {
            if (mode === "Edit") {
                editRecord(data);
            } else {
                addRecord(data);
            }
        }
        
        submitFormRef.reset();
    };
    
    const clearImages = () => {
        images.forEach(file => URL.revokeObjectURL(file.preview));
        setImages([]);
    };

    const onReset = (e) => {
        e.preventDefault();
        submitFormRef.reset();
        clearImages()
    };

    const initEditFields = () => {
        for (var i = 0; i < recordFields.length; i++) {
            setValue(recordFields[i], oldRecord[recordFields[i]] ?? "");
        }
    };

    if (mode === "Edit") {
        initEditFields();
    }

    if (!recordFields.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>
                Table fields not found!
            </h1>
        );
    }

    return (
        <form ref={(el) => submitFormRef = el} onSubmit={handleSubmit(onSubmit)}>
            <h3>{mode} mode for {currentTable}</h3>
            {recordFields.map((field, index) => (
                <div key={index}>
                    <label>{field}:</label>
                    {field === "photo" ?
                        <div className={cl.addPhoto}>
                            <OpenImgDialog 
                            onData={handleDataFromChild} 
                            setFiles={setImages} 
                            files={images} />
                        </div>
                        : ""
                    }
                    <GeneralInput
                        refs={register(`${field}`)}
                        placeholder={field}
                        type="text"
                        defaultValue={(oldRecord && oldRecord[field]) ?? ""}
                        onChange={e => setValue(field, e.target.value)}
                        disabled={field === "photo" ? true : false}
                    />
                </div>
            ))}
            <div className={cl.containerForm}>
                <GeneralButton type="submit">
                    Submit
                </GeneralButton>
                <GeneralButton onClick={onReset}>
                    Reset
                </GeneralButton>
            </div>

            <div>
                {validation &&
                    <span>
                        {validation} is required!
                    </span>
                }

                {modifyRecordError &&
                    <span>
                        {modifyRecordError}
                    </span>
                }
            </div>
        </form>
    );
};