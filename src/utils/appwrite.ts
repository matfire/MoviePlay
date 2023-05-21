import { Client, Account, Databases, Avatars, ID, Functions } from "appwrite";
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const functions = new Functions(client);

const getDocuments = (collectionId: string, queries: string[]) => {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    queries
  );
};

const getDocument = (collectionId: string, documentId: string) => {
  return databases.getDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    documentId
  );
};

const createDocument = (collectionId: string, data: any, roles: any) => {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    ID.unique(),
    data,
    roles
  );
};

const updateDocument = (
  collectionId: string,
  documentId: string,
  data: any
) => {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    documentId,
    data
  );
};

const deleteDocument = (collectionId: string, documentId: string) => {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    documentId
  );
};

const updateStatistic = async (documentId: string) => {
  try {
    functions.createExecution(
      import.meta.env.VITE_APPWRITE_STATISTICS_FUNCTION_ID,
      JSON.stringify({ id: documentId })
    );
  } catch (error) {
    console.log(error);
  }
};

export {
  client,
  account,
  databases,
  avatars,
  getDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  updateStatistic,
};
