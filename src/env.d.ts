// Tells TypeScript that importing a .vue file gives a Vue component.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
