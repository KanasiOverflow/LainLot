import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetching } from '../hooks/useFetching';
import { getRecordById } from '../utils/getRecordById';
import Loader from '../components/UI/loader/Loader';

export default function RecordIdPage() {

    const params = useParams();

    const [record, setRecord] = useState({});

    const [fetchRecordById, isLoading, error] = useFetching(async (table, id) => {
        const response = await getRecordById(table, id);
        setRecord(response.data);
    });

    useEffect(() => {
        fetchRecordById(params.table, params.id);
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <h1>{params.table} page with id {params.id}</h1>
            {error !== null
                ? isLoading
                    ? <Loader />
                    : <div>
                        {Object.keys(record).map(key =>
                            <div key={key}>
                                {key}: {record[key]}
                            </div>
                        )}
                    </div>
                : <h1>{error.message}</h1>}
        </div>
    );
};