import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from '../src/features/delivery/routes/deliveryRoutes'
import { Provider } from 'react-redux'
import { store } from './app/store'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
