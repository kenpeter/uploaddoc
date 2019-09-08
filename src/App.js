import React from 'react';
import DocUpload from './components/DocUpload';

const docUploadConfig = {
  fileTypes: ['image/jpeg', 'image/png'],
  minSize: 0,
  maxSize: 1048576, // 10mb
  mutiple: true
};

function App() {
  return (
    <div className="App">
      <DocUpload config={docUploadConfig}/>
    </div>
  );
}

export default App;
