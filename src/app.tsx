import { Provider } from "react-redux";

import configStore from "@/state/config/store";

import "./app.less";

const store = configStore();

const App = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default App;
