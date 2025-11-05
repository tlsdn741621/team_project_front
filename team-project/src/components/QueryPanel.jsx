import React from 'react';

const QueryPanel = ({
    startDate, setStartDate,
    endDate, setEndDate,
    minMagnitude, maxMagnitude,
    minDepth, maxDepth,
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
                <h3>Custom Query</h3>
                <div className="panel-header-icons">
                    <span>⟳</span>
                    <span>×</span>
                </div>
            </div>

            {/* Catalog */}
            <div className="query-field-group">
                <label>Catalog</label>
                <div className="query-field-input-container">
                    <select className="catalog-input">
                        <option>Auto</option>
                    </select>
                </div>
            </div>

            {/* Date */}
            <div className="query-field-group">
                <label>Date</label>
                <div className="date-range-group">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <span>-</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
            </div>

            {/* Magnitude */}
            <div className="query-field-group">
                <label>Magnitude</label>
                <div className="slider-input-wrapper">
                    <input type="number" value={minMagnitude} readOnly />
                    <div className="slider-track">
                        <div
                            className="slider-fill"
                            style={{
                                width: `${((maxMagnitude - minMagnitude) / (10 - 3)) * 100}%`,
                                marginLeft: `${((minMagnitude - 3) / (10 - 3)) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <input type="number" value={maxMagnitude} readOnly />
                </div>
            </div>

            {/* Depth */}
            <div className="query-field-group">
                <label>Depth</label>
                <div className="slider-input-wrapper">
                    <input type="number" value={minDepth.toFixed(1)} readOnly />
                    <div className="slider-track">
                        <div
                            className="slider-fill"
                            style={{
                                width: `${((maxDepth - minDepth) / 6371) * 100}%`,
                                marginLeft: `${(minDepth / 6371) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <input type="number" value={maxDepth} readOnly />
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
