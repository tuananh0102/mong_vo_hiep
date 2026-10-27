import '@fontsource/noto-serif/vietnamese-400.css'
import '@fontsource/noto-serif/vietnamese-700.css'
import '../../giao_dien/tokens.css'
import '../../giao_dien/thanh_phan.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="vk-man-hinh" />
  </StrictMode>,
)
