import { appendNewValues } from "./index";

test('returns 1 with new value 1 and old snapshot 1', () => {
  const result = appendNewValues(1, 1)

  expect(result).toEqual(1);
});

test('returns 2 with new value 2 and old snapshot 1', () => {
  const result = appendNewValues(2, 1)

  expect(result).toEqual(2);
});

test('returns same memory array [1,2] with new value [1,2] and old snapshot [1,2]', () => {
  const oldValue = [1, 2];
  const newValue = [1, 2];
  const result = appendNewValues(newValue, oldValue)

  expect(result).toEqual(newValue);
  expect(result === newValue).toBe(true);
});

test('returns new memory array [1,2,3] with new value [1,2,3] and old snapshot [1,2]', () => {
  const oldValue = [1, 2];
  const newValue = [1, 2, 3];
  const result = appendNewValues(newValue, oldValue)

  expect(result).toEqual(newValue);
  expect(result === newValue).toBe(false);
});

test('returns same memory object { foo: "bar" } with new value { foo: "bar" } and old snapshot { foo: "bar" }', () => {
  const oldValue = { foo: "bar" };
  const newValue = { foo: "bar" };
  const result = appendNewValues(newValue, oldValue)

  expect(result).toEqual(newValue);
  expect(result === newValue).toBe(true);
});

test('returns new memory object { foo: "bar" } with new value { foo: "bar" } and old snapshot { foo: "baz" }', () => {
  const oldValue = { foo: "baz" };
  const newValue = { foo: "bar" };
  const result = appendNewValues(newValue, oldValue)

  expect(result).toEqual(newValue);
  expect(result === newValue).toBe(false);
});

test('nested object', () => {
  let oldValue = {
    posts: [
      { id: 1, name: 'Post 1' },
      { id: 2, name: 'Post 2' },
      { id: 3, name: 'Post 3' }
    ],
    likes: [
      {
        id: 1,
        count: 10
      }
    ]
  };

  const newValue = JSON.parse(JSON.stringify(oldValue));

  const result1 = appendNewValues(newValue, oldValue);

  expect(result1).toEqual(newValue);
  expect(result1).toEqual(oldValue);
  expect(result1 === newValue).toBe(true); // the result object is unchanged

  // remove the last post
  newValue.posts.splice(2, 1);
  const result2 = appendNewValues(newValue, oldValue)

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

  const result3 = appendNewValues(newValue, oldValue)

  // changing only the first post
  expect(result3 === newValue).toBe(false); // result object is is re-created due to deep change

  expect(result3.posts === newValue.posts).toBe(false); // posts array is re-created
  expect(result3.likes === newValue.likes).toBe(true); // likes array is unchanged

  expect(result3.posts[0] === newValue.posts[0]).toBe(false); // first post is re-created
  expect(result3.posts[0].name).toEqual('New name');

  expect(result3.posts[1] === newValue.posts[1]).toBe(true); // second post is unchanged
});