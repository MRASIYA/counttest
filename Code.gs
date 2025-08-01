// Google Apps Script Code.gs
// Replace with your actual Google Sheet ID
const SHEET_ID = '1uVKj3fmeIu0ExCLEeEQ6_7X3Hqi9DEA65ophongr56Y';
const SHEET_NAME = 'Sheet1';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('Material Data Entry System');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getMaterials() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and get material data
    const materials = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] && row[2]) { // Check if Material Code and Material Name exist
        materials.push({
          row: i + 1, // Actual row number in sheet (1-based)
          type: row[0] || '',
          materialCode: row[1] || '',
          materialName: row[2] || '',
          uom: row[3] || '',
          opStock: row[4] || 0,
          received: row[5] || 0,
          issued: row[6] || 0,
          returnQty: row[7] || 0,
          closingStock: row[8] || 0
        });
      }
    }
    
    return materials;
  } catch (error) {
    console.error('Error getting materials:', error);
    throw new Error('Failed to load materials: ' + error.message);
  }
}

function updateMaterial(materialRow, operation, quantity) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const numQuantity = parseFloat(quantity) || 0;
    
    if (numQuantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    // Get current values
    const currentReceived = parseFloat(sheet.getRange(materialRow, 6).getValue()) || 0;
    const currentIssued = parseFloat(sheet.getRange(materialRow, 7).getValue()) || 0;
    const currentReturn = parseFloat(sheet.getRange(materialRow, 8).getValue()) || 0;
    const opStock = parseFloat(sheet.getRange(materialRow, 5).getValue()) || 0;
    
    let newReceived = currentReceived;
    let newIssued = currentIssued;
    let newReturn = currentReturn;
    
    // Update based on operation
    switch (operation.toLowerCase()) {
      case 'received':
        newReceived = currentReceived + numQuantity;
        sheet.getRange(materialRow, 6).setValue(newReceived);
        break;
      case 'issued':
        newIssued = currentIssued + numQuantity;
        sheet.getRange(materialRow, 7).setValue(newIssued);
        break;
      case 'return':
        newReturn = currentReturn + numQuantity;
        sheet.getRange(materialRow, 8).setValue(newReturn);
        break;
      default:
        throw new Error('Invalid operation type');
    }
    
    // Calculate and update closing stock (Op.Stock + Received - Issued + Return)
    const closingStock = opStock + newReceived - newIssued + newReturn;
    sheet.getRange(materialRow, 9).setValue(closingStock);
    
    // Add timestamp of last update
    const timestamp = new Date();
    
    return {
      success: true,
      message: 'Successfully updated ' + operation + ': ' + quantity,
      newValues: {
        received: newReceived,
        issued: newIssued,
        return: newReturn,
        closingStock: closingStock
      },
      timestamp: timestamp.toLocaleString()
    };
    
  } catch (error) {
    console.error('Error updating material:', error);
    return {
      success: false,
      message: 'Error updating material: ' + error.message
    };
  }
}

function getTransactionHistory(materialRow, limit) {
  if (typeof limit === 'undefined') {
    limit = 10;
  }
  
  try {
    // This is a simple implementation - you might want to create a separate sheet for transaction history
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const materialName = sheet.getRange(materialRow, 3).getValue();
    
    return {
      success: true,
      materialName: materialName,
      message: 'Transaction history feature can be implemented with a separate transactions sheet'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error getting transaction history: ' + error.message
    };
  }
}

function validateSheetStructure() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const headers = sheet.getRange(1, 1, 1, 9).getValues()[0];
    
    const expectedHeaders = [
      'Type',
      'Material Code', 
      'Material Name',
      'UOM',
      'Op.Stock-Warehouse',
      'Received',
      'Issued',
      'Return',
      'Useable Material Total Closing Stock'
    ];
    
    return {
      success: true,
      headers: headers,
      expectedHeaders: expectedHeaders
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error validating sheet structure: ' + error.message
    };
  }
}
