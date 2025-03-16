import * as Services from 'api/CRUD';

export const getRecordFields = async (currentTable, login, password) => {
  if (!Services[`${currentTable}Service`] || !Services[`${currentTable}Service`].GetFields) {
    console.error(`Service or GetFields method not found for table: ${currentTable}`);
    return null;
  }

  try {
    return await Services[`${currentTable}Service`].GetFields(login, password);
  } catch (error) {
    console.error(`Error fetching fields from ${currentTable}:`, error);
    return null;
  }
};
