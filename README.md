# Material Data Entry Web Application

## Overview
This Google Apps Script web application provides an interface for entering material transaction data (Received, Issued, Return) into your Google Sheet. The application automatically calculates and updates the closing stock based on the transactions.

## Features
- **Material Selection**: Dropdown list of all materials from your sheet
- **Real-time Stock Display**: Shows current stock levels for selected material
- **Transaction Entry**: Support for Received, Issued, and Return operations
- **Automatic Calculations**: Updates closing stock automatically
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and validation

## Sheet Structure
Your Google Sheet should have the following columns in Sheet1:
- **Column A**: Type
- **Column B**: Material Code
- **Column C**: Material Name
- **Column D**: UOM (Unit of Measure)
- **Column E**: Op.Stock-Warehouse (Opening Stock)
- **Column F**: Received
- **Column G**: Issued
- **Column H**: Return
- **Column I**: Useable Material Total Closing Stock

## Setup Instructions

### Step 1: Create Google Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Rename the project to "Material Data Entry System"

### Step 2: Add the Code Files
1. Replace the default `Code.gs` content with the code from `Code.gs` file
2. Create new HTML files by clicking the + button:
   - Create `Index.html` and paste the content from `Index.html`
   - Create `Stylesheet.html` and paste the content from `Stylesheet.html`
   - Create `JavaScript.html` and paste the content from `JavaScript.html`

### Step 3: Configure Sheet ID
1. In `Code.gs`, update the `SHEET_ID` constant with your Google Sheet ID:
   ```javascript
   const SHEET_ID = '1uVKj3fmeIu0ExCLEeEQ6_7X3Hqi9DEA65ophongr56Y';
   ```
   (The ID is already set to your sheet)

### Step 4: Deploy the Web App
1. Click "Deploy" > "New deployment"
2. Choose type: "Web app"
3. Set execute as: "Me"
4. Set access to: "Anyone with the link" or "Anyone" (depending on your needs)
5. Click "Deploy"
6. Copy the web app URL provided

### Step 5: Set Permissions
1. The first time you run the deployment, you'll need to authorize the script
2. Grant the necessary permissions to access your Google Sheet

## How to Use

### Adding Transactions
1. **Select Material**: Choose a material from the dropdown list
2. **Review Details**: Check the current stock levels displayed
3. **Choose Operation**: Select Received, Issued, or Return
4. **Enter Quantity**: Input the transaction quantity
5. **Submit**: Click "Submit Transaction"

### Stock Calculation
The closing stock is automatically calculated using:
```
Closing Stock = Opening Stock + Received - Issued + Return
```

### Features
- **Auto-refresh**: Material info updates in real-time
- **Validation**: Prevents invalid entries
- **Loading indicators**: Shows progress during operations
- **Success/Error messages**: Clear feedback on all actions
- **Keyboard shortcuts**: 
  - Ctrl+Enter: Submit transaction
  - Escape: Reset form

## Troubleshooting

### Common Issues
1. **"Failed to load materials"**: Check that the Sheet ID is correct and the sheet exists
2. **"Permission denied"**: Ensure the script has access to your Google Sheet
3. **"Invalid operation type"**: Make sure you selected Received, Issued, or Return
4. **"Quantity must be greater than 0"**: Enter a positive number for quantity

### Sheet Requirements
- Column headers must be in row 1
- Material data should start from row 2
- Material Code and Material Name are required fields
- Numeric columns should contain valid numbers

## Advanced Features

### Extending the Application
You can enhance the application by:
1. Adding transaction history tracking
2. Implementing user authentication
3. Adding export functionality
4. Creating dashboard views
5. Adding material search functionality

### Transaction History (Optional)
To add transaction history, create a second sheet called "Transactions" with columns:
- Date/Time
- Material Code
- Material Name
- Operation Type
- Quantity
- User (if authentication is added)

## Security Notes
- The web application requires access to your Google Sheet
- Consider setting access permissions appropriately
- For production use, implement proper authentication
- Regular backups of your sheet data are recommended

## Support
For issues or questions about this application:
1. Check the browser console for detailed error messages
2. Verify your sheet structure matches the requirements
3. Ensure all required permissions are granted
4. Test with a simple transaction first

## Version Information
- **Version**: 1.0
- **Created**: 2024
- **Compatibility**: Google Apps Script, Google Sheets
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

**Note**: This application directly modifies your Google Sheet data. Always maintain backups of important data before using any automated systems.
