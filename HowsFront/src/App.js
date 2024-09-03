import './App.css';
import {Home} from "./pages/Home/Home";
import {Header} from "./components/Header/Header";
import {host} from "./config/config";
import {Footer} from "./components/Footer/Footer";

function App() {

  console.log("host ==== ", host);

  // 로딩

  // if login

  return (
    <div className="App">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
