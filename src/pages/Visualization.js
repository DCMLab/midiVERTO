import React, { useState } from 'react';

export default function Visualization() {
  const [pitchClass, setPitchClass] = useState('');
  const [file, setFile] = useState('');

  const handleSubmit = (e) => {
    //In order not to refresh the page (default behaviuor)
    e.preventDefault();
    console.log(pitchClass);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='pitchClass'>Pitch class: </label>
          <input
            type='text'
            name='pitchClass'
            id='pitchClass'
            value={pitchClass}
            onChange={(e) => setPitchClass(e.target.value)}
          />
        </div>
      </form>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='file'>Select a MIDI file: </label>
          <input
            type='file'
            id='file'
            name='file'
            value={file}
            onChange={(e) => setFile(e.target.value)}
          />
          <button type='submit'>Submit</button>
        </div>
      </form>
      <h1>The application goes here</h1>
    </>
  );
}
