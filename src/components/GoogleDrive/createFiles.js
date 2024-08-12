import createFolder from './createFolder';
const mimeTypes = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.java': 'text/x-java-source',
    '.py': 'text/x-python',
    '.rb': 'text/x-ruby',
    '.php': 'application/x-httpd-php',
    '.c': 'text/x-c',
    '.cpp': 'text/x-c++',
    '.h': 'text/x-c',
    '.go': 'text/x-go',
    '.swift': 'text/x-swift',
    '.ts': 'application/typescript',
    '.tsx': 'application/typescript',
    // Add more mappings as needed
};
// Function to get the folder ID based on folder name

const generateBoundary = () => `boundary_${Math.random().toString(36).substring(2)}`;

const getMimeType = (fileName) => {
    const ext = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
    return mimeTypes[`.${ext}`] || 'application/octet-stream'; // Default MIME type
};

const getFileIdByName = async (accessToken, fileName, folderId) => {
    try {
        // Create URL search parameters
        const params = new URLSearchParams({
            q: `name='${fileName}' and '${folderId}' in parents and mimeType!='application/vnd.google-apps.folder'`,
        });

        const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error fetching file ID: ${response.status} ${response.statusText} - ${errorData.error.message}`);
        }

        const data = await response.json();
        const files = data.files || [];

        if (files.length > 0) {
            return files[0].id; // Return the ID of the first matching file
        }

        return null; // File does not exist
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to retrieve file ID.');
    }
};


const createOrUpdateFile = async (accessToken, fileName, content, fileCreated, fileLoading) => {
    if (accessToken && fileName) {
        try {
            fileLoading(true);
            // Get the folder ID for "GeminiIDE"
            const folderId = await createFolder(accessToken, 'GeminiIDE');
            const mimeType = getMimeType(fileName);

            // Check if the file already exists
            const fileId = await getFileIdByName(accessToken, fileName, folderId);

            const fileMetadata = {
                name: fileName,
                mimeType: mimeType,
            };

            let body;
            let method;
            let url;

            if (fileId) {
                // Update existing file
                method = 'PATCH';
                url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&addParents=${folderId}`;
                body = `--boundary
Content-Type: application/json; charset=UTF-8

${JSON.stringify(fileMetadata)}
--boundary
Content-Type: ${mimeType}

${content}
--boundary--`;
            } else {
                // Create new file
                method = 'POST';
                url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&parents=${folderId}`;
                body = `--boundary
Content-Type: application/json; charset=UTF-8

${JSON.stringify(fileMetadata)}
--boundary
Content-Type: ${mimeType}

${content}
--boundary--`;
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/related; boundary=boundary',
                },
                body: body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData); // Log detailed error information
                throw new Error(`Error ${fileId ? 'updating' : 'creating'} file: ${response.status} ${response.statusText} - ${errorData.error.message}`);
            }

            const data = await response.json();
            console.log(`File '${fileName}' ${fileId ? 'updated' : 'created'} successfully in the 'GeminiIDE' folder!`);
            console.log('File Details:', data);
            fileCreated(true);
        } catch (error) {
            console.error('Error:', error);
            fileCreated(false);
        } finally {
            fileLoading(false);
        }
    } else {
        console.error('Access token, file name, and content are required.');
    }
};


export default createOrUpdateFile;