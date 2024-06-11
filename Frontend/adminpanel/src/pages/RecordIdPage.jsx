import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetching } from '../hooks/useFetching';
import PostService from '../API/FakePostService';
import Loader from '../components/UI/loader/Loader';

export default function RecordIdPage() {

    const params = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

    const [fetchPostById, isLoading, error] = useFetching(async (id) => {
        const response = await PostService.getbyId(id);
        setPost(response.data);
    });

    const [fetchComments, isCommentsLoading, errorComments] = useFetching(async (id) => {
        const response = await PostService.getCommentsById(id);
        setComments(response.data);
    });

    useEffect(() => {
        fetchPostById(params.id);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchComments(params.id);
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <h1>Post page with id {params.id}</h1>
            {error !== null
                ? isLoading
                    ? <Loader />
                    : <div>
                        <h4>{post.id}. {post.title}</h4>
                        <div>{post.body}</div>
                    </div>
                : <h1>{error.message}</h1>}
            <h1>
                Comments
            </h1>
            {errorComments !== null
                ? isCommentsLoading
                    ? <Loader />
                    :
                    <div>
                        {comments.map(comm =>
                            <div key={comm.id} style={{ marginTop: 15 }}>
                                <h5>{comm.email}</h5>
                                <div>{comm.body}</div>
                            </div>
                        )}
                    </div>
                : <h1>{error.message}</h1>}
        </div>
    );
};