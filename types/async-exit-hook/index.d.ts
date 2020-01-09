declare module 'async-exit-hook' {
  const exitHook: (cb: (done: () => any) => any) => void;
  export = exitHook;
}
