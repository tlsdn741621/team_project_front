import React from 'react';

const QueryPanel = ({
    startDate, setStartDate,
    magnitude, setMagnitude,
    depth, setDepth,
    northCoord, setNorthCoord,
    westCoord, setWestCoord,
    eastCoord, setEastCoord,
    southCoord, setSouthCoord,
    handleGetEvents,
    isPredicting,
    status,
    predictionResult,
    predictionError
}) => {
    return (
        <div className="custom-query-panel">
            <div className="panel-header">
                <h3>Prediction</h3>
                <div className="panel-header-icons">
                    <span>⟳</span>
                    <span>×</span>
                </div>
            </div>



            {/* Date */}
            <div className="query-field-group">
                <label>Today Date</label>
                <div className="date-range-group">
                    <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
            </div>

            {/* Magnitude */}
            <div className="query-field-group">
                <label>Magnitude</label>
                <div className="slider-input-wrapper">
                    <input 
                        type="range" 
                        min="3.0" 
                        max="9.5" 
                        step="0.1" 
                        value={magnitude} 
                        onChange={(e) => setMagnitude(isNaN(parseFloat(e.target.value)) ? 3.0 : parseFloat(e.target.value))}
                    />
                    <input 
                        type="number" 
                        min="3.0" 
                        max="9.5" 
                        step="0.1" 
                        value={magnitude} 
                        onChange={(e) => setMagnitude(isNaN(parseFloat(e.target.value)) ? 3.0 : parseFloat(e.target.value))} 
                        className="magnitude-display"
                    />
                </div>
            </div>

            {/* Depth */}
            <div className="query-field-group">
                <label>Depth</label>
                <div className="slider-input-wrapper">
                    <input 
                        type="range" 
                        min="300" 
                        max="800" 
                        step="1" 
                        value={depth} 
                        onChange={(e) => setDepth(isNaN(parseFloat(e.target.value)) ? 300 : parseFloat(e.target.value))}
                        className="depth-slider"
                    />
                    <input 
                        type="number" 
                        min="300" 
                        max="800" 
                        step="1" 
                        value={depth} 
                        onChange={(e) => setDepth(isNaN(parseFloat(e.target.value)) ? 300 : parseFloat(e.target.value))} 
                        className="depth-display"
                    />
                </div>
            </div>

            {/* Location */}
            <div className="query-field-group">
                <label>Location</label>
                <div className="location-input-grid">
                    <span className="location-label-n">N</span>
                    <input type="text" placeholder="Lat" value={northCoord} onChange={(e) => setNorthCoord(e.target.value)} className="input-lat-n" />

                    <span className="location-label-w">W</span>
                    <input type="text" placeholder="Lon" value={westCoord} onChange={(e) => setWestCoord(e.target.value)} className="input-lon" />
                    <span className="location-label-e">E</span>

                    <span className="location-label-s">S</span>
                </div>
            </div>

            {/* Get Events Button */}
            <button
                className="get-events-button"
                onClick={handleGetEvents}
                disabled={isPredicting || status !== 'ready'}
            >
                {isPredicting ? '로딩 중...' : 'Get Events'}
            </button>

            {/* Prediction Result (기능 유지를 위해 남겨둠) */}
            {predictionResult && (
                <p className="prediction-message prediction-success">{predictionResult}</p>
            )}
            {predictionError && (
                <p className="prediction-message prediction-error">{predictionError}</p>
            )}
        </div>
    );
};

export default QueryPanel;
// End of QueryPanel.jsx
