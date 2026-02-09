import { sportsData } from "./data/SportsData";
import SportsList from "./components/SportsList";
import {Header} from './components/Header1'
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header/>
      <SportsList data={sportsData} />



      
      <Footer/>
    </div>
  );
}

export default App;