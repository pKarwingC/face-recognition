import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({box, imageUrl})=> {
    if(imageUrl){
        return (
            <div className="center ma">
                <div className="absolute mt2">
                    <img id="face-reco-img" src={imageUrl} alt="awesome pic" width="500px" height="auto" />
                    <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                </div>
            </div>
        );
    }else{
        return (
            <></>
        );
    }
};

export default FaceRecognition;