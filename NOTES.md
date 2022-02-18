# Notes

I shared some of my personal preferences and ideas that I thought when implementing move function. I hope you find them useful.

## Preferences

1. **I don't like to mutate original arguments**. I decided to use spread operator to create new array.

```ts
// Line: 17
const fileSystem = [...list];
```

2. **Instead of using indices, I would rather use iterators which are in my opinion more readable.** I changed it to indices because of eslint rules.

```ts
// Line: 23
for (const folder of fileSystem) {
  // ...

  // Line: 37
  for (const [index, file] of folder.files.entries()) {
    // ...
  }
}
```

3. **After if statement, I prefer to not use block if there is only one expression.** But I decided to use block anyway, because it can create more space and does not clutter the code.

```ts
// Line: 26
if (folder.id === source) {
  throw new Error('You cannot move a folder');
}

// My personal preference

// Line: 26
if (folder.id === source) throw new Error('You cannot move a folder');

// Line: 35
if (sourceFolderIndex !== -1 && destinationFolderIndex !== -1) break;
```

## Ideas

1. **I was going to use array methods (like `some`, `find`, `findIndex`), because I think it becomes more readable**. But since it increases time complexity, I decided not to use them.

```ts
type CustomFile = {
  id: string;
  name: string;
};

type Folder = {
  id: string;
  name: string;
  files: CustomFile[];
};

type List = Folder[];

export default function move(list: List, source: string, destination: string): List {
  const fileSystem = [...list];

  const isSourceFolder = fileSystem.some((folder) => folder.id === source);
  if (isSourceFolder) throw new Error('You cannot move a folder');

  const isDestinationFile = fileSystem.some((folder) =>
    folder.files.some((file) => file.id === destination),
  );
  if (isDestinationFile) throw new Error('You cannot specify a file as the destination');

  const sourceFolder = fileSystem.find((folder) => folder.files.some((file) => file.id === source));
  const destinationFolder = fileSystem.find((folder) => folder.id === destination);

  if (!sourceFolder) throw new Error('Source file cannot be found');
  if (!destinationFolder) throw new Error('Destination folder cannot be found');
  if (sourceFolder.id === destinationFolder.id)
    throw new Error('Source file is already in destination folder');

  const sourceFileIndex = sourceFolder.files.findIndex((file) => file.id === source)!;
  const [sourceFile] = sourceFolder.files.splice(sourceFileIndex, 1);

  destinationFolder.files.push(sourceFile);
  return fileSystem;
}
```

2. I was going to create `'HashMap'` from `list` to make it easier to find a folder and files. But `time complexity of conversions` are `O(n \* m)`. Also it significantly increases code base. I couldn't find a good way to reduce overall time complexity and I decided not to use it.

```ts
type CustomFile = {
  id: string;
  name: string;
};

type Folder = {
  id: string;
  name: string;
  files: CustomFile[];
};

type List = Folder[];

type FileWithOrder = CustomFile & { order: number };
type FileMap = Record<string, FileWithOrder>;
type FolderMap = Omit<Folder, 'files'> & { files: FileMap };
type FileSystem = Record<string, FolderMap>;

function createFileSystemFromList(list: List): FileSystem {
  return list.reduce((fileSystem, folder) => {
    return {
      ...fileSystem,
      [folder.id]: {
        id: folder.id,
        name: folder.name,
        files: folder.files.reduce((files, file, index) => {
          return { ...files, [file.id]: { ...file, order: index } };
        }, {} as FileMap),
      },
    };
  }, {} as FileSystem);
}

function createListFromFileSystem(fileSystem: FileSystem): List {
  return Object.values(fileSystem).map((folder) => ({
    id: folder.id,
    name: folder.name,
    files: Object.values(folder.files)
      .sort((a, b) => a.order - b.order)
      .map(({ order, ...file }) => file),
  }));
}

export default function move(list: List, source: string, destination: string): List {
  const fileSystem = createFileSystemFromList(list);

  let sourceFolder: FolderMap | undefined;
  const folders = Object.values(fileSystem);

  for (let i = 0; i < folders.length; i += 1) {
    const folder = folders[i];
    if (folder.id === source) {
      throw new Error('You cannot move a folder');
    }

    if (folder.files[destination]) {
      throw new Error('You cannot specify a file as the destination');
    }

    if (folder.files[source]) {
      sourceFolder = folder;
    }
  }

  if (!sourceFolder) {
    throw new Error('Source file cannot be found');
  }

  const destinationFolder = fileSystem[destination];
  if (!destinationFolder) {
    throw new Error('Destination folder cannot be found');
  }

  if (sourceFolder.id === destinationFolder.id) {
    throw new Error('Source file is already in destination folder');
  }

  const sourceFile = sourceFolder.files[source];
  delete sourceFolder.files[source];
  destinationFolder.files[sourceFile.id] = sourceFile;

  return createListFromFileSystem(fileSystem);
}
```
