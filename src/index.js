import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/reset.css'

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
// StrictMode вимкнено: antd Menu використовує findDOMNode (deprecated), плюс подвійний mount у dev дає дубль запитів
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
