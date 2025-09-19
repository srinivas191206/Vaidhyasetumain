// Mock service implementations to replace Firebase services
// This allows the application to run without Firebase dependencies

// Mock Firestore-like database
class MockCollection {
  private data: any[] = [];
  private idCounter: number = 1;

  add(data: any) {
    const id = `mock-id-${this.idCounter++}`;
    const doc = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.data.push(doc);
    console.log('Mock Firestore: Added document to collection', doc);
    return Promise.resolve({ id });
  }

  get() {
    console.log('Mock Firestore: Getting all documents from collection');
    return Promise.resolve(this.data);
  }

  doc(id: string) {
    return new MockDocument(this.data.find(d => d.id === id) || null);
  }
}

class MockDocument {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  get() {
    console.log('Mock Firestore: Getting document', this.data);
    return Promise.resolve({ exists: () => !!this.data, data: () => this.data });
  }

  update(data: any) {
    console.log('Mock Firestore: Updating document', data);
    return Promise.resolve();
  }
}

// Mock Firestore functions
export const collection = (db: any, name: string) => {
  console.log('Mock Firestore: Creating collection', name);
  return new MockCollection();
};

export const addDoc = (collection: MockCollection, data: any) => {
  console.log('Mock Firestore: Adding document to collection', data);
  return collection.add(data);
};

export const getDoc = (doc: MockDocument) => {
  console.log('Mock Firestore: Getting document');
  return doc.get();
};

export const updateDoc = (doc: MockDocument, data: any) => {
  console.log('Mock Firestore: Updating document', data);
  return doc.update(data);
};

export const doc = (db: any, collectionName: string, id: string) => {
  console.log('Mock Firestore: Getting document reference', collectionName, id);
  return new MockDocument(null);
};

export const query = (...args: any[]) => {
  console.log('Mock Firestore: Creating query', args);
  return {};
};

export const where = (...args: any[]) => {
  console.log('Mock Firestore: Creating where clause', args);
  return {};
};

export const orderBy = (...args: any[]) => {
  console.log('Mock Firestore: Creating orderBy clause', args);
  return {};
};

export const limit = (count: number) => {
  console.log('Mock Firestore: Creating limit clause', count);
  return {};
};

export const getDocs = async (query: any) => {
  console.log('Mock Firestore: Getting documents with query', query);
  // Return mock data
  return {
    size: 2,
    forEach: (callback: any) => {
      const mockDocs = [
        { id: 'mock-doc-1', data: () => ({ name: 'Mock Doc 1' }) },
        { id: 'mock-doc-2', data: () => ({ name: 'Mock Doc 2' }) }
      ];
      mockDocs.forEach(callback);
    }
  };
};

export const setDoc = async (docRef: any, data: any) => {
  console.log('Mock Firestore: Setting document', docRef, data);
  return Promise.resolve();
};

export const deleteDoc = async (docRef: any) => {
  console.log('Mock Firestore: Deleting document', docRef);
  return Promise.resolve();
};

export const onSnapshot = (query: any, callback: any, errorCallback?: any) => {
  console.log('Mock Firestore: Setting up snapshot listener');
  // Simulate real-time updates with mock data
  setTimeout(() => {
    callback({
      forEach: (fn: any) => {
        // Mock data for testing
        const mockDocs = [
          { id: 'mock-1', data: () => ({ title: 'Mock Notification 1', message: 'This is a mock notification' }) },
          { id: 'mock-2', data: () => ({ title: 'Mock Notification 2', message: 'This is another mock notification' }) }
        ];
        mockDocs.forEach(fn);
      },
      docChanges: () => [{
        type: 'added',
        doc: {
          data: () => ({
            userId: 'mock-user-id',
            candidate: 'mock-candidate-data',
            sdpMLineIndex: 0,
            sdpMid: 'mock-sdp-mid'
          })
        }
      }]
    });
  }, 100);
  
  // Return unsubscribe function
  return () => {
    console.log('Mock Firestore: Unsubscribed from snapshot listener');
  };
};

export const serverTimestamp = () => {
  return new Date();
};

export const increment = (value: number) => {
  return { increment: value };
};

export const Timestamp = {
  fromDate: (date: Date) => {
    return { seconds: date.getTime() / 1000, toDate: () => date };
  },
  now: () => {
    return { seconds: Date.now() / 1000, toDate: () => new Date() };
  }
};

// Mock Auth service
export const getAuth = (app: any) => {
  console.log('Mock Auth: Initializing auth service');
  return {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      console.log('Mock Auth: Setting up auth state listener');
      // Simulate user being signed in
      setTimeout(() => {
        callback({ uid: 'mock-user-id', displayName: 'Mock User' });
      }, 100);
      return () => {};
    }
  };
};

// Mock Storage service
export const getStorage = (app: any) => {
  console.log('Mock Storage: Initializing storage service');
  return {
    ref: (path: string) => {
      console.log('Mock Storage: Creating reference', path);
      return {
        put: (file: any) => {
          console.log('Mock Storage: Uploading file', file);
          return Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('https://example.com/mock-file-url') } });
        }
      };
    }
  };
};

// Mock Analytics service
export const getAnalytics = (app: any) => {
  console.log('Mock Analytics: Initializing analytics service');
  return {
    logEvent: (eventName: string, params?: any) => {
      console.log('Mock Analytics: Logging event', eventName, params);
    }
  };
};

// Mock Messaging service
export const getMessaging = (app: any) => {
  console.log('Mock Messaging: Initializing messaging service');
  return {
    getToken: () => {
      console.log('Mock Messaging: Getting token');
      return Promise.resolve('mock-messaging-token');
    },
    onMessage: (callback: any) => {
      console.log('Mock Messaging: Setting up message listener');
      return () => {};
    }
  };
};

// Mock App initialization
export const initializeApp = (config: any) => {
  console.log('Mock Firebase: Initializing app with config', config);
  return { name: 'mock-app', options: config };
};

// Export types
export type Analytics = ReturnType<typeof getAnalytics>;
export type Messaging = ReturnType<typeof getMessaging>;
export type FieldValue = any;