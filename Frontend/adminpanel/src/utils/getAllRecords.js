import * as Services from 'api/CRUD';

export const getAllRecords = async (currentTable, limit, page, login, password) => {
  if (!Services[`${currentTable}Service`] || !Services[`${currentTable}Service`].Get) {
    console.error(`Service or Get method not found for table: ${currentTable}`);
    return null;
  }

  try {
    return await Services[`${currentTable}Service`].Get(limit, page, login, password);
  } catch (error) {
    console.error(`Error fetching records from ${currentTable}:`, error);
    return null;
  }
};
