export const nameof = <T>(selector: (obj: T) => any): string => {
  let propName = "";
  const proxy = new Proxy({}, {
    get: (_, prop) => {
      propName = String(prop);
      return proxy;
    }
  });
  selector(proxy as T);
  return propName;
};