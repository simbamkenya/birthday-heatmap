import logo from './logo.svg';
import './App.css';
import Heat from './components/Heat';

function App() {
  return (
    <div className="App">
      <div className='min-h-full bg-[#faebd7] mx-auto'>
        <div className='flex justify-center'>
            <div className='text-center'>
              <span className='text-xl capitalize font-semibold'>Popularity of your birthday</span>
              <p className='text-sm italic'>Based on US data between 2000-2014</p>
              <Heat />
            </div>
        </div>
      </div>    
    </div>
  );
}

export default App;
