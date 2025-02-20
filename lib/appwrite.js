import { Account, Client, ID, Avatars, Databases } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.alepan.vidai',
    projectId: '67ad8ff100345ed9b828',
    databaseId: '67adb8fb0025ab866bf4',
    userCollectionId: '67adb9940005e9802876',
    videoCollectionId: '67aed8e000223ee009d0',
    storageId: '67aedc5a001ffb704ea3'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;

// initialize Account instance
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;
        console.log(`account create`)
        // get Avatar url
        const avatarUrl = avatars.getInitials(username);
        console.log(`avatarUrl`)

        // signIn after user creation
        await signIn(email, password);
        console.log(`signIn`)

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        console.log(`createDocument`)

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        // try to establish a new user session
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error)
    }
}