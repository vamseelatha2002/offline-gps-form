function doPost(e) {
  const sheet = SpreadsheetApp.openById('1STnFZCyA3tqawnTjaUmRFHNy5GOP4B-3cfdI-5Dhjoo').getSheetByName('Sheet1');
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.date,
    data.quantity,
    data.activity,
    data.hours,
    data.startDate,
    data.endDate,
    data.itemType,
    data.latitude,
    data.longitude
  ]);
  return ContentService.createTextOutput("Success");
}
