import * as Services from 'api/index.js';

export const getAllRecords = async (table, limit, page, login, password) => {
  if (!Services[`${table}Service`] || !Services[`${table}Service`].Get) {
    console.error(`Service or Get method not found for table:`, table);
    return null;
  }

  try {
    return await Services[`${table}Service`].Get(limit, page, login, password);
  } catch (error) {
    console.error(`Error fetching records from ${table}:`, error);
    return null;
  }
};
