import React from 'react';
import './ImageFormLink.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit})=> {
    return (
        <div>
            <p className="f3">
                Smart Brain can detect faces in your picture. Give it a try.
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input onChange={onInputChange} className="f4 pa4 w-70 center" type="text" />
                    <button onClick={onButtonSubmit} className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Detect</button>
                </div>
            </div>
        </div>
    );
};

export default ImageLinkForm;