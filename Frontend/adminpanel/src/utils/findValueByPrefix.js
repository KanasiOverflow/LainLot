export const findValueByPrefix = (object, prefix) => {
    for (var property in object) {
        if (object.hasOwnProperty(property) && property.toString().startsWith(prefix)) {
            return {
                key: property,
                value: object[property]
            };
        }
    }
};