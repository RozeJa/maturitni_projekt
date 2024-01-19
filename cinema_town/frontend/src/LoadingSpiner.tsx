import { RingLoader } from 'react-spinners';
import './LoadingSpiner.css'

const LoadingSpinner = ({ loading } : { loading: boolean}) => {
  return (
    <div className="loading-spinner">
      <RingLoader color={'#123abc'} loading={loading} />
    </div>
  );
};

export default LoadingSpinner;