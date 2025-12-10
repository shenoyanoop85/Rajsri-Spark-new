
// =================================================================
// PASTE THIS CODE INTO YOUR GOOGLE APPS SCRIPT EDITOR (Code.gs)
// IMPORTANT: AFTER PASTING, CLICK "DEPLOY" > "NEW VERSION"
// =================================================================

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  // 1. LOGIN USER (Exact Match on Phone)
  if (action === 'login') {
    const sheet = ss.getSheetByName('Profiles');
    const rows = sheet.getDataRange().getValues();
    // Assuming Column F (Index 5) is Phone.
    // Clean phone input just in case
    const inputPhone = String(data.phone).replace(/\D/g,'');
    
    // Skip header row
    const userRow = rows.slice(1).find(r => String(r[5]).replace(/\D/g,'') === inputPhone);
    
    if (userRow) {
      const user = {
        id: userRow[0],
        name: userRow[1],
        role: userRow[2],
        avatar: userRow[3],
        email: userRow[4],
        phone: userRow[5],
        unit: userRow[6],
        volunteer_services: userRow[7] ? String(userRow[7]).split(',') : []
      };
      return response({ success: true, user: user });
    } else {
      return response({ success: false, message: 'User not found' });
    }
  }

  // 2. SEARCH USERS (Admin Search)
  if (action === 'search_users') {
    const sheet = ss.getSheetByName('Profiles');
    const rows = sheet.getDataRange().getValues();
    const query = data.query ? data.query.toString().toLowerCase() : '';
    const headers = rows.shift(); // Remove header

    // Search Name (1), Phone (5), or Unit (6)
    // Limit to 20 results to keep it fast
    const matches = rows.filter(r => 
      String(r[1]).toLowerCase().includes(query) || 
      String(r[5]).includes(query) || 
      String(r[6]).toLowerCase().includes(query)
    ).slice(0, 20);

    const profiles = matches.map(row => {
      // Map back to object manually
      return {
        id: row[0],
        name: row[1],
        role: row[2],
        avatar: row[3],
        email: row[4],
        phone: row[5],
        unit: row[6],
        volunteer_services: row[7] ? String(row[7]).split(',') : []
      };
    });

    return response({ profiles: profiles });
  }
  
  // 3. GET PUBLIC DATA (Events, Notices & SETTINGS)
  if (action === 'get_public_data') {
    return response({
      events: getSheetData(ss.getSheetByName('Events')),
      announcements: getSheetData(ss.getSheetByName('Announcements')),
      settings: getSheetData(ss.getSheetByName('Settings')), // NEW: Fetch settings
    });
  }

  // 4. ADD ITEM
  if (action === 'add_item') {
    const tab = ss.getSheetByName(data.sheetName);
    if (!tab) return response({status: 'error', message: 'Sheet not found'});
    tab.appendRow(data.row);
    return response({ status: 'success' });
  }

  // 5. UPDATE ITEM
  if (action === 'update_item') {
    const tab = ss.getSheetByName(data.sheetName);
    const id = data.id;
    const newRow = data.row;
    const dataRange = tab.getDataRange().getValues();
    
    for (let i = 1; i < dataRange.length; i++) {
      if (dataRange[i][0] == id) {
        tab.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
        return response({ status: 'success' });
      }
    }
    return response({ status: 'error', message: 'ID not found' });
  }

  // 6. DELETE ITEM
  if (action === 'delete_item') {
    const tab = ss.getSheetByName(data.sheetName);
    const id = data.id;
    const dataRange = tab.getDataRange().getValues();
    
    for (let i = 1; i < dataRange.length; i++) {
      if (dataRange[i][0] == id) {
        tab.deleteRow(i + 1);
        return response({ status: 'success' });
      }
    }
    return response({ status: 'error', message: 'ID not found' });
  }

  return response({ status: 'error', message: 'Invalid action' });
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return []; 
  const headers = rows.shift();
  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      // Handle list fields
      if ((h === 'requirements' || h === 'benefits' || h === 'volunteer_services') && typeof row[i] === 'string') {
        obj[h] = row[i].split(',').map(s => s.trim()).filter(s => s);
      } else {
        obj[h] = row[i];
      }
    });
    // Normalization to CamelCase for frontend
    if (obj.image_url) obj.imageUrl = obj.image_url;
    if (obj.is_high_priority !== undefined) obj.isHighPriority = obj.is_high_priority;
    if (obj.registered_count !== undefined) obj.registeredCount = obj.registered_count;
    if (obj.valid_from) obj.validFrom = obj.valid_from;
    if (obj.valid_to) obj.validTo = obj.valid_to;
    return obj;
  });
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
