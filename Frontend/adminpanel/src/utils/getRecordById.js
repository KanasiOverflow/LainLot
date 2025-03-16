import * as Services from 'api/CRUD';

export const getRecordById = async (currentTable, id, login, password) => {
  if (!Services[`${currentTable}Service`] || !Services[`${currentTable}Service`].GetById) {
    console.error(`Service or GetById method not found for table: ${currentTable}`);
    return null;
  }

  try {
    return await Services[`${currentTable}Service`].GetById(id, login, password);
  } catch (error) {
    console.error(`Error fetching record from ${currentTable}:`, error);
    return null;
  }
};
