import * as Services from 'api';

export const updateRecord = async (currentTable, data, login, password) => {
  if (!Services[`${currentTable}Service`] || !Services[`${currentTable}Service`].Update) {
    console.error(`Service or Update method not found for table: ${currentTable}`);
    return null;
  }

  try {
    return await Services[`${currentTable}Service`].Update(data, login, password);
  } catch (error) {
    console.error(`Error updating record in ${currentTable}:`, error);
    return null;
  }
};
