# Object-deep-replace

This library compares inputs deeply and creates new memory references when a value or its children inside the input change, but makes sure not to create new memory references where unnecessary.

It works by comparing 2 inputs - the new altered object/array and a previous cloned snapshot.

```ts
import { deepRecreate } from "object-deep-recreate";

const snapshot = [{ id: 1, name: 'Post1' }, { id: 2, name: 'Post2' }]
const posts = JSON.parse(JSON.stringify(snapshot))

posts[0].name = 'New name'

const result = deepRecreate(posts, snapshot);

expect(result[0] === posts[0]).toBe(false); // first post is changed inside, new memory reference
expect(result[1] === posts[1]).toBe(true); // second post stayed untouched, original memory reference
```
More test cases can be found below, or in the `__tests__` folder:

---

```ts
  let oldValue = {
    posts: [
      { id: 1, name: 'Post 1' },
      { id: 2, name: 'Post 2' },
      { id: 3, name: 'Post 3' }
    ],
    likes: [{ id: 1, count: 10 }]
  };

  const newValue = JSON.parse(JSON.stringify(oldValue));

  const result1 = deepRecreate(newValue, oldValue);

  expect(result1).toEqual(newValue);
  expect(result1).toEqual(oldValue);
  expect(result1 === newValue).toBe(true); // the result object is unchanged

  // remove the last post
  newValue.posts.splice(2, 1);
  const result2 = deepRecreate(newValue, oldValue)

  expect(result2).toEqual(newValue);  // the data has the same format
  expect(result2).not.toEqual(oldValue);
  expect(result2 === newValue).toBe(false); // the result object is re-created due to deep change

  expect(result2.likes === newValue.likes).toBe(true); // likes array is unchanged
  expect(result2.posts === newValue.posts).toBe(false); // posts array is re-created

  // however the first and second post remained the same
  expect(result2.posts[0] === newValue.posts[0]).toBe(true); // post 1 is unchanged
  expect(result2.posts[1] === newValue.posts[1]).toBe(true); // post 2 is unchanged

  // changing an object inside the array but keeping the array's length

  oldValue = JSON.parse(JSON.stringify(newValue)); // create new snapshot before modifying the memory value
  newValue.posts[0].name = 'New name'; // rename first post

  const result3 = deepRecreate(newValue, oldValue)

  // changing only the first post
  expect(result3 === newValue).toBe(false); // result object is is re-created due to deep change

  expect(result3.posts === newValue.posts).toBe(false); // posts array is re-created
  expect(result3.likes === newValue.likes).toBe(true); // likes array is unchanged

  expect(result3.posts[0] === newValue.posts[0]).toBe(false); // first post is re-created
  expect(result3.posts[0].name).toEqual('New name');

  expect(result3.posts[1] === newValue.posts[1]).toBe(true); // second post is unchanged
```