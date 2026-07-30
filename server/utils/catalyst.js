const catalyst = require('zcatalyst-sdk-node');

/**
 * Initialize Catalyst app from request
 * Every request to Catalyst contains authentication context
 */
function initCatalyst(req) {
  return catalyst.initialize(req);
}

/**
 * Get Data Store table by name
 */
function getTable(catalystApp, tableName) {
  const datastore = catalystApp.datastore();
  return datastore.table(tableName);
}

/**
 * Get all rows from a table with optional filter
 */
async function getAllRows(table) {
  try {
    const result = await table.getAllRows();
    return result;
  } catch (error) {
    console.error('Error fetching rows:', error);
    throw error;
  }
}

/**
 * Insert a row into a table
 */
async function insertRow(table, rowData) {
  try {
    const result = await table.insertRow(rowData);
    return result;
  } catch (error) {
    console.error('Error inserting row:', error);
    throw error;
  }
}

/**
 * Update a row in a table
 */
async function updateRow(table, rowId, rowData) {
  try {
    rowData.ROWID = rowId;
    const result = await table.updateRow(rowData);
    return result;
  } catch (error) {
    console.error('Error updating row:', error);
    throw error;
  }
}

/**
 * Delete a row from a table
 */
async function deleteRow(table, rowId) {
  try {
    const result = await table.deleteRow(rowId);
    return result;
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
function getCurrentUser(catalystApp) {
  try {
    return catalystApp.userManagement().getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

module.exports = {
  initCatalyst,
  getTable,
  getAllRows,
  insertRow,
  updateRow,
  deleteRow,
  getCurrentUser
};
