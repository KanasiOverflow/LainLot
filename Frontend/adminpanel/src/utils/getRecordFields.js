import * as Services from 'api';

export const getRecordFields = async (table, login, password) => {
  if (!Services[`${table}Service`] || !Services[`${table}Service`].GetFields) {
    console.error(`Service or GetFields method not found for table:`, table);
    return null;
  }

  try {
    return await Services[`${table}Service`].GetFields(login, password);
  } catch (error) {
    console.error(`Error fetching fields from ${table}:`, error);
    return null;
  }
};
