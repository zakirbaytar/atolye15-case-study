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
  throw new Error('Not implemented');
}
