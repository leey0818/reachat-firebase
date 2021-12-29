import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import koKR from 'antd/lib/locale/ko_KR';
import './index.css';
import './firebase';
import App from './App';
import store from './store';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfigProvider locale={koKR}>
        <App />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
