import createFolder from './createFolder'; // Adjust the path as necessary

const updateFileName = async (accessToken, folderName, currentFileName, newFileName, fileNameChanged = () => { }, fileNameChanging = () => { }) => {
    if (!accessToken || !folderName || !currentFileName || !newFileName) {
        console.error('Access token, folder name, current file name, and new file name are required.');
        return null; // or handle it as needed
    }

    try {
        fileNameChanging(true);
        // Get the folder ID using the fetchFolder function
        const folderId = await createFolder(accessToken, folderName);

        if (!folderId) {
            console.log(`Folder '${folderName}' not found.`);
            return null; // Folder not found
        }

        // Search for the file by name within the specific folder
        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(currentFileName)}'+and+'${folderId}'+in+parents`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            throw new Error(`Error searching for file: ${searchResponse.status} ${searchResponse.statusText}. ${errorText}`);
        }

        const searchData = await searchResponse.json();

        if (searchData.files.length === 0) {
            console.log(`File '${currentFileName}' not found in folder '${folderName}'.`);
            return null; // File not found in the specified folder
        }

        const fileId = searchData.files[0].id;

        // Update the file name
        const updateResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newFileName,
            }),
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Error updating file name: ${updateResponse.status} ${updateResponse.statusText}. ${errorText}`);
        }

        const updateData = await updateResponse.json();
        console.log(`File name updated successfully from '${currentFileName}' to '${newFileName}'!`);
        fileNameChanged(true);
        fileNameChanging(false);
        return updateData.name; // Return the updated file name
    } catch (error) {
        fileNameChanged(false);
        fileNameChanging(false);
        console.error('Error:', error.message);
        console.log('Failed to update file name.');
        return null; // or handle it as needed
    }
};

export default updateFileName;
