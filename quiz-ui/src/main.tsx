import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Quiz from './quiz';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Quiz />
  </StrictMode>,
)
