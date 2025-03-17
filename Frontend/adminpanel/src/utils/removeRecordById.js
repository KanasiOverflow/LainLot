import * as Services from 'api';

export const removeRecordById = async (currentTable, id, login, password) => {
  if (!Services[`${currentTable}Service`] || !Services[`${currentTable}Service`].Delete) {
    console.error(`Service or Delete method not found for table: ${currentTable}`);
    return null;
  }

  try {
    return await Services[`${currentTable}Service`].Delete(id, login, password);
  } catch (error) {
    console.error(`Error deleting record from ${currentTable}:`, error);
    return null;
  }
};
