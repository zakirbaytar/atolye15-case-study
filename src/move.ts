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

  let sourceFolderIndex = -1;
  let destinationFolderIndex = -1;
  let sourceFileIndex = -1;

  for (let folderIndex = 0; folderIndex < fileSystem.length; folderIndex += 1) {
    const folder = fileSystem[folderIndex];

    if (folder.id === source) {
      throw new Error('You cannot move a folder');
    }

    if (folder.id === destination) {
      destinationFolderIndex = folderIndex;
      // I would normally break here, but there is an edge case where the source file is in destination folder
    }

    if (sourceFolderIndex !== -1 && destinationFolderIndex !== -1) break;

    for (let fileIndex = 0; fileIndex < folder.files.length; fileIndex += 1) {
      const file = folder.files[fileIndex];

      if (file.id === destination) {
        throw new Error('You cannot specify a file as the destination');
      }

      if (file.id === source) {
        sourceFolderIndex = folderIndex;
        sourceFileIndex = fileIndex;
        break;
      }
    }
  }

  if (sourceFolderIndex === -1) {
    throw new Error('Source file cannot be found');
  }
  if (destinationFolderIndex === -1) {
    throw new Error('Destination folder cannot be found');
  }

  if (sourceFolderIndex === destinationFolderIndex) {
    throw new Error('Source file is already in destination folder');
  }

  const sourceFolder = fileSystem[sourceFolderIndex];
  const destinationFolder = fileSystem[destinationFolderIndex];
  const [sourceFile] = sourceFolder.files.splice(sourceFileIndex, 1);
  destinationFolder.files.push(sourceFile);

  return fileSystem;
}
