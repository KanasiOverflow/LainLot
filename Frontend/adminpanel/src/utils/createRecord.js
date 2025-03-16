import * as Services from 'api/CRUD';

export const createRecord = async (currentTable, data, login, password) => {
  if (!Services[`${currentTable}Service`] || !Services[`${currentTable}Service`].Create) {
    console.error(`Service or Create method not found for table: ${currentTable}`);
    return null;
  }

  try {
    return await Services[`${currentTable}Service`].Create(data, login, password);
  } catch (error) {
    console.error(`Error creating record in ${currentTable}:`, error);
    return null;
  }
};
