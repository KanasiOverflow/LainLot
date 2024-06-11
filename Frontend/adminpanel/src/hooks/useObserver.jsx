import { useEffect, useRef } from 'react';

export const useObserver = (ref, canLoad, isLoading, callBack) => {

    const observer = useRef();

    useEffect(() => {
        if (isLoading) return;
        if (ref.current === undefined || ref.current === null) return;
        if (observer === null) return;
        if (observer.current) observer.current.disconnect();

        var callBackObserver = (entries) => {
            if (entries[0].isIntersecting && canLoad) {
                callBack();
            }
        };

        observer.current = new IntersectionObserver(callBackObserver);
        observer.current.observe(ref.current);
    }, [isLoading]);
};