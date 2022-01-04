import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import koKR from 'antd/lib/locale/ko_KR';
import moment from 'moment';
import 'moment/locale/ko';
import './index.css';
import './firebase';
import App from './App';
import store from './store';

// change moment locale
moment.locale('ko');

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
