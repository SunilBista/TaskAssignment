import "./App.css";
import LoginPage from "./components/pages/auth/LoginPage";
import StorageProvider from "./components/contexts/UserContext";
import DashBoard from "./components/pages/DashBoard/index";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <StorageProvider>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route path="/" component={DashBoard} />
        </Switch>
      </StorageProvider>
    </div>
  );
}

export default App;
