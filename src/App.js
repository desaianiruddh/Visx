import './App.css';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Example from './components/Annotation'

const App = () => {
  return (
    <div>
      <ParentSize>{({ width, height }) => <Example width={width} height={height} />}</ParentSize>
    </div>
  );
}

export default App;
