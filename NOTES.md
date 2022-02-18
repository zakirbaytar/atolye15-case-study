# Notes

I shared some of my personal preferences and ideas that I thought when implementing move function. I hope you find them useful.

## Preferences

1. **I don't like to mutate original arguments**. I decided to use spread operator to create new array.

```js
// Line: 17
const fileSystem = [...list];
```

2. **Instead of using indices, I would rather use iterators which are in my opinion more readable.** I changed it to indices because of eslint rules.

```js
// Line: 23
for (const folder of fileSystem) {
  // ...

  // Line: 37
  for (const [index, file] of folder.files.entries()) {
    // ...
  }
}
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
