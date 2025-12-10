
// ------------------------------------------------------------------
// CONFIGURATION: Replace this with your Google Apps Script Web App URL
// ------------------------------------------------------------------
// Example format: https://script.google.com/macros/s/AKfycbx.../exec
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIXnFk-zBluWxa10s0PUM3fEiqCHPQSEwu-aQWN08LSBH34az_UMQ5KFP2MNHkh1FHxQ/exec'; 

// Helper to make requests to the Google Script
export const sheetApi = {
    // Fetch all data (Events, Announcements, Profiles)
    getData: async () => {
        if (!GOOGLE_SCRIPT_URL) throw new Error("Script URL not configured");
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'get_data' })
        });
        
        return await response.json();
    },

    // Add a new row to a specific sheet
    addItem: async (sheetName: string, row: any[]) => {
        if (!GOOGLE_SCRIPT_URL) return; 
        
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                action: 'add_item',
                sheetName,
                row
            })
        });
    },

    // Update an existing row based on ID (assumes ID is in the first column)
    updateItem: async (sheetName: string, id: string, row: any[]) => {
        if (!GOOGLE_SCRIPT_URL) return;

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'update_item',
                sheetName,
                id, // The ID to find
                row // The new row data
            })
        });
        
        // Wait for the response to ensure the operation completed
        return await response.json();
    },

    // Delete a row based on ID
    deleteItem: async (sheetName: string, id: string) => {
        if (!GOOGLE_SCRIPT_URL) return;

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'delete_item',
                sheetName,
                id
            })
        });
        
        return await response.json();
    }
};
