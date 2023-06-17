import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'

console.log("main.tsx")

render(<App />, document.getElementById('app') as HTMLElement)
