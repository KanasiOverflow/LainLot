import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import GeneralButton from './UI/button/GeneralButton';
import GeneralInput from './UI/input/GeneralInput';
import OpenImgDialog from './UI/openImgDialog/OpenImgDialog';

export default function RecordForm({ mode, currentTable, create, edit, fields, oldRecord, requestError }) {

    var submitFormRef = useRef();
    const [validation, setValidation] = useState(undefined);

    const {
        register,
        setValue,
        handleSubmit,
    } = useForm();

    const onSubmit = (data) => {
        var isValid = true;

        for (var i = 0; i < fields.length; i++) {
            if (data[fields[i]] === undefined) {
                isValid = false;
                setValidation(fields[i]);
                break;
            }
            setValidation(undefined);
        }

        if (isValid) {
            if (mode === "Edit") {
                edit(data);
            }
            else {
                create(data);
            }
        }

        submitFormRef.reset();
    };

    const onReset = (e) => {
        e.preventDefault();
        submitFormRef.reset();
    };

    const initEditFields = () => {
        for (var i = 0; i < fields.length; i++) {
            setValue(fields[i], oldRecord[fields[i]] ?? "");
        }
    };

    if (mode === "Edit") {
        initEditFields();
    }

    if (!fields.length) {
        return (
            <h1 style={{ textAlign: 'center' }}>
                Table fields not found!
            </h1>
        );
    }

    return (
        <form ref={(el) => submitFormRef = el} onSubmit={handleSubmit(onSubmit)}>
            <h3>{mode} mode for {currentTable}</h3>
            {fields.map((field, index) => (
                <div key={index}>
                    <label>{field}:</label>
                    {field === "photo" ?
                        <div className='add-photo'>
                            <OpenImgDialog />
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
            <div className='container-form'>
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

                {requestError &&
                    <span>
                        {requestError}
                    </span>
                }
            </div>
        </form>
    );
};