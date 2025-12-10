
// ------------------------------------------------------------------
// CONFIGURATION: YOUR GOOGLE APPS SCRIPT WEB APP URL
// ------------------------------------------------------------------
// IMPORTANT: 
// 1. Deploy your script as "Web App"
// 2. Set "Execute as" -> "Me"
// 3. Set "Who has access" -> "Anyone"
// 4. Paste the URL below
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIXnFk-zBluWxa10s0PUM3fEiqCHPQSEwu-aQWN08LSBH34az_UMQ5KFP2MNHkh1FHxQ/exec'; 

// Helper to handle fetch and parsing
const fetchJson = async (payload: any) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('your-script-url')) {
        throw new Error("Script URL not configured. Please update googleSheetsClient.ts");
    }
    
    try {
        // We use 'text/plain' to avoid CORS Preflight (OPTIONS) requests which GAS often fails on.
        // The script's JSON.parse(e.postData.contents) handles this format perfectly.
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(payload) 
        });

        if (!response.ok) {
             throw new Error(`HTTP Error: ${response.status}`);
        }

        const text = await response.text();
        
        // Handle HTML error responses (common with Google Script errors)
        if (text.trim().startsWith('<')) {
             console.error("Server returned HTML instead of JSON:", text);
             throw new Error("Server returned an invalid response. Check Script permissions.");
        }
        
        return JSON.parse(text);
    } catch (err) {
        console.error("API Connection Failed:", err);
        throw err;
    }
};

export const sheetApi = {
    // 1. PUBLIC DATA: Only fetch Events and Announcements
    getPublicData: async () => {
        return await fetchJson({ action: 'get_public_data' });
    },

    // 2. LOGIN: Search for 1 user on the server side
    loginUser: async (mobile: string) => {
        return await fetchJson({ 
            action: 'login',
            phone: mobile
        });
    },

    // 3. ADMIN SEARCH: Search users server-side
    searchUsers: async (query: string) => {
        if (!GOOGLE_SCRIPT_URL) return { profiles: [] };
        return await fetchJson({ 
            action: 'search_users',
            query: query
        });
    },

    // 4. ADD ITEM
    addItem: async (sheetName: string, row: any[]) => {
        if (!GOOGLE_SCRIPT_URL) return; 
        return await fetchJson({ 
            action: 'add_item',
            sheetName,
            row
        });
    },

    // 5. UPDATE ITEM
    updateItem: async (sheetName: string, id: string, row: any[]) => {
        if (!GOOGLE_SCRIPT_URL) return;
        return await fetchJson({
            action: 'update_item',
            sheetName,
            id,
            row
        });
    },

    // 6. DELETE ITEM
    deleteItem: async (sheetName: string, id: string) => {
        if (!GOOGLE_SCRIPT_URL) return;
        return await fetchJson({
            action: 'delete_item',
            sheetName,
            id
        });
    }
};
