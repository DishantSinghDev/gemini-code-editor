const createFolder = async (accessToken, folderName) => {
    if (!accessToken || !folderName) {
        console.error('Access token and folder name are required.');
        return null; // or handle it as needed
    }

    try {
        // Check if the folder already exists
        const listResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(folderName)}'+and+mimeType='application/vnd.google-apps.folder'`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            throw new Error(`Error checking folder: ${listResponse.status} ${listResponse.statusText}. ${errorText}`);
        }
        
        const listData = await listResponse.json();
        
        console.log("List Folder",listData)
        if (listData.files.length > 0) {
            // Folder exists
            const existingFolderId = listData.files[0].id;
            console.log(`Folder '${folderName}' already exists.`);
            return existingFolderId;
        }

        // Create the folder if it does not exist
        const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            }),
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            throw new Error(`Error creating folder: ${createResponse.status} ${createResponse.statusText}. ${errorText}`);
        }

        const createData = await createResponse.json();
        const newFolderId = createData.id;
        console.log(`Folder '${folderName}' created successfully!`);
        console.log('Created Folder:', createData);
        return newFolderId;
    } catch (error) {
        console.error('Error:', error.message);
        console.log('Failed to create folder.');
        return null; // or handle it as needed
    }
};

export default createFolder;
