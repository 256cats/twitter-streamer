export function delay<T>(cb: () => T, timeout: number): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(cb()), timeout)
  })
}
