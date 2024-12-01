export const checkDateOrTimeField = (name) => {
    
    if (name === "createdAt" || name === "updatedAt" || name === "changedAt" || 
        name.toLowerCase().indexOf("date") !== -1){
        return "datetime-local";
    }
    else if (name === "timeFormat" || name === "dateFormat"){
        return "text";
    }

    return "text";
};