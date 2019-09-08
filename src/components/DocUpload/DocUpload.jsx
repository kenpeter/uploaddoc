import React, {useCallback, useState} from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone';

// own style
import {StyledDocUpload} from './DocUpload.styles';

// main
const DocUpload = ({config}) => {
  // state: arr of files
  const [myFiles, setMyFiles] = useState([]);

  // file types
  const getAcceptedFileTypes = config => {
    const acceptedFileTypes = config.fileTypes.join(',');
    return acceptedFileTypes;
  };

  // drop
  const onDrop = useCallback(acceptedFiles => {
    // when drop, inject files into state
    setMyFiles([...myFiles, ...acceptedFiles]);
  });

  // rm files
  const removeFile = file => () => {
    // all my files
    const newFiles = [...myFiles];
    // remove 1
    newFiles.splice(newFiles.indexOf(file), 1);
    // now set file state
    setMyFiles(newFiles);
  };

  const readFilePromise = file => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = error => {
        reject(error);
      };
    });
  };

  // do doc upload
  const doDocUpload = async () => {
    const uploadUrl = 'http://localhost:4000/api/1.0/docUpload';
    const dataForm = new FormData();
    const base64Arr = [];
    let file64;

    for (let i = 0; i < myFiles.length; i++) {
      // base64 file
      file64 = await readFilePromise(myFiles[i]);
      base64Arr.push(file64);

      // upload physical file
      dataForm.append('file', myFiles[i]);
    }

    //test
    console.log('arr', base64Arr);

    axios
      .post(uploadUrl, dataForm, {
        // receive two    parameter endpoint url ,form data
      })
      .then(res => {
        // then print response status
        console.log('upload completed', res.statusText);
      })
      .catch(err => {
        console.log('upload err', err);
      });
  };

  // root, input
  const {getRootProps, getInputProps, rejectedFiles} = useDropzone({
    // on drop, set inject file state
    onDrop,
    // file type
    accept: getAcceptedFileTypes(config),
    // min
    minSize: config.minSize,
    // max
    maxSize: config.maxSize,
    // mul
    multiple: config.multiple
  });

  // too big
  const isFileTooLarge =
    rejectedFiles.length > 0 && rejectedFiles[0].size > config.maxSize;

  // list files + rm
  const files = myFiles.map((file, ind) => (
    <li key={ind}>
      {file.path}
      <button onClick={removeFile(file)}>
        Remove
      </button>
    </li>
  ));

  return (
    <div>
      <StyledDocUpload>
        <ul>{files}</ul>

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>
            Drop here
          </p>
        </div>
        {isFileTooLarge && <p>File is too large.</p>}
      </StyledDocUpload>
      <button onClick={doDocUpload}>Upload</button>
    </div>
  );
};

export default DocUpload;
