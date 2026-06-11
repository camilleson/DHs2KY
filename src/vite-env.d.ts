/// <reference types="vite/client" />

declare module '*.JPG' {
  const src: string
  export default src
}

declare module '*.JPEG' {
  const src: string
  export default src
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Kakao: any;
}
