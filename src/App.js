import logo from './logo.svg';
import './App.css';
import Heat from './components/Heat';

function App() {
  return (
    <div className="App">
      <div className='min-h-full bg-[#768A95] mx-auto'>
        <div className='flex justify-center'>
            <div className='text-center'>
              <span className='text-base capitalize  font-semibold text-white text-lg pt-4'>Popularity of your birthday</span>
              {/* <p className='text-sm italic'>Based on US data between 2000-2014</p> */}
              <Heat />
            </div>
        </div>
      </div>    
    </div>
  );
}

export default App;
