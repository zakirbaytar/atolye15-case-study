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
