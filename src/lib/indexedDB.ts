export default class IndexedDB {
  static open(name: string, version: number): Promise<IDBDatabase> {
    // Open DB
    const request = indexedDB.open(name, version);

    // Returns promise
    return new Promise((resolve, rejects) => {
      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onupgradeneeded = (e) => {
        const IDB = request.result;

        if (e.oldVersion < 1) {
          const taskStore = IDB.createObjectStore("task", {
            keyPath: "_id",
            autoIncrement: true,
          });
          taskStore.createIndex("content", "content");
          taskStore.createIndex("urgency", "urgency");
          taskStore.createIndex("deadLine", "deadLine");

          const fixedTaskStore = IDB.createObjectStore("fixedTask", {
            keyPath: "_id",
            autoIncrement: true,
          });
          fixedTaskStore.createIndex("content", "content");
          fixedTaskStore.createIndex("startTime", "startTime");
          fixedTaskStore.createIndex("endTime", "endTime");
          fixedTaskStore.createIndex("repeatType", "repeatType");

          const trash = IDB.createObjectStore("trash", {
            keyPath: "_id",
            autoIncrement: true,
          });
          trash.createIndex("type", "type");
        }
      };
    });
  }

  static create<T>(
    DB: IDBDatabase,
    store: string,
    data: T
  ): Promise<IDBValidKey> {
    // Open transaction
    const transaction = DB.transaction(store, "readwrite");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.add(data);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  static read<T>(
    DB: IDBDatabase,
    store: string,
    query: IDBValidKey | IDBKeyRange
  ): Promise<T> {
    // Open transaction
    const transaction = DB.transaction(store, "readonly");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(query);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  static update(
    DB: IDBDatabase,
    store: string,
    query: IDBValidKey,
    data: any
  ): Promise<any> {
    // Open transaction
    const transaction = DB.transaction(store, "readwrite");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(query);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        const prevData: any = request.result;

        if (typeof data.checked !== "undefined") {
          prevData.checked = data.checked;
        }
        if (typeof data.content !== "undefined") {
          prevData.content = data.content;
        }
        if (typeof data.updated !== "undefined") {
          prevData.updated = data.updated;
        }
        if (typeof data.start !== "undefined") {
          prevData.start = data.start;
        }
        if (typeof data.end !== "undefined") {
          prevData.end = data.end;
        }

        const updateReq = objectStore.put(prevData);
        updateReq.onerror = () => {
          rejects(updateReq.error);
        };
        updateReq.onsuccess = () => {
          console.log("updated");
          resolve(updateReq.result);
        };
      };
    });
  }

  static delete(
    DB: IDBDatabase,
    store: string,
    query: IDBValidKey | IDBKeyRange
  ): Promise<any> {
    // Open transaction
    const transaction = DB.transaction(store, "readwrite");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(query);

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  static readAll<T>(DB: IDBDatabase, store: any): Promise<T[]> {
    // Open transaction
    const transaction = DB.transaction(store, "readonly");

    // Returns promise
    return new Promise((resolve, rejects) => {
      const objectStore = transaction.objectStore(store);
      const request = objectStore.openCursor();
      const result: T[] = [];

      request.onerror = () => {
        rejects(request.error);
      };
      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
    });
  }
}
