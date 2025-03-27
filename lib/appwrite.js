import { Account, Client, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.alepan.vidai',
    projectId: '67ad8ff100345ed9b828',
    databaseId: '67adb8fb0025ab866bf4',
    userCollectionId: '67adb9940005e9802876',
    videoCollectionId: '67aed8e000223ee009d0',
    storageId: '67aedc5a001ffb704ea3'
}

//expose properties of config object outside of it
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    ;

// initialize Account instance
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;
        // get Avatar url
        const avatarUrl = avatars.getInitials(username);

        // signIn after user creation
        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        // try to establish a new user session
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(`getAccount: `+ error);
    }
  }

export const getCurrentUser = async () => {
    try {
        
        const currentAccount = await getAccount();
        
        if (!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        
        if (!currentUser) throw Error;
        return currentUser.documents[0]
    } catch (error) {
        console.log(`getCurrentUser: `+error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}


export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )
        
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}


export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )
        
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
             fileUrl = storage.getFileView(storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    
    if (!file) return;
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };
    

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl;
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        
        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                creator: form.userId
              }
        )
        console.log(3)
        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}