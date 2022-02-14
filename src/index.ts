/**
 * Make sure the compared values are of the same type
 * @param newValue - altered in-memory data
 * @param prevValue - cloned snapshot of previous data
 */
export function appendNewValues<T = unknown>(newValue: T, prevValue: T) {
  if (typeof newValue !== typeof prevValue) {
    console.warn('Comparing different types');
    return newValue;
  }

  // for primitive types return new value right away
  if (typeof newValue !== 'object') return newValue;

  if (Array.isArray(newValue)) {
    if (!Array.isArray(prevValue)) {
      console.warn('Comparing array with non-array');
      return newValue;
    }

    if (JSON.stringify(newValue) === JSON.stringify(prevValue)) {
      return newValue;
    }

    let result: any[];

    // check every element if same length
    if (newValue.length === prevValue.length) {
      result = []

      newValue.forEach((v, index) => {
        const oldV = prevValue[index];
        result.push(appendNewValues(v, oldV))
      })
    } else {
      // else removing or adding to array, just create a new instance
      result = [...newValue]
    }

    return result;
  }

  return appendNewObjectValues(newValue, prevValue);
}

/**
 * @param newObject
 * @param prevObject - cloned snapshot of previous data
 */
export function appendNewObjectValues<T = Record<any, unknown>>(newObject: T, prevObject: T) {
  if (JSON.stringify(newObject) === JSON.stringify(prevObject)) return newObject;

  const result: Record<any, unknown> = {}

  Object.keys(newObject).forEach((key: any) => {
    const newValue = (newObject as any)?.[key];
    const prevValue = (prevObject as any)?.[key];
    result[key] = appendNewValues(newValue, prevValue);
  })

  return result
}
