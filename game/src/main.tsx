import '@fontsource/noto-serif/vietnamese-400.css'
import '@fontsource/noto-serif/vietnamese-700.css'
import '../../giao_dien/tokens.css'
import '../../giao_dien/thanh_phan.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UngDung } from './giao_dien/UngDung'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UngDung />
  </StrictMode>,
)
