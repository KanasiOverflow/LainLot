export const getRestAPIUrl = () => {

    const REACT_APP_RESTAPI_URL_DEV = process.env.REACT_APP_RESTAPI_URL_DEV;
    const REACT_APP_RESTAPI_URL_PROD = process.env.REACT_APP_RESTAPI_URL_PROD;
    const REACT_APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;

    return REACT_APP_ENVIRONMENT === "Development"
        ? REACT_APP_RESTAPI_URL_DEV
        : REACT_APP_RESTAPI_URL_PROD;
};