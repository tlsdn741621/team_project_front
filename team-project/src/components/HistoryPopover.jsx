import React from 'react';
import { Overlay, Popover } from 'react-bootstrap';

const HistoryPopover = ({ show, target, queryHistory }) => {
    return (
        <Overlay
            show={show}
            target={target}
            placement="bottom"
        >
            <Popover id="popover-contained" className="history-popover">
                <Popover.Header as="h3">History</Popover.Header>
                <Popover.Body className="history-popover-body">
                    {queryHistory.length > 0 ? (
                        queryHistory.map((query, index) => (
                            <div key={index} className="history-item">
                                <p><strong>Query {index + 1}:</strong></p>
                                <p><strong>Start Date:</strong> {query.startDate}</p>
                                <p><strong>End Date:</strong> {query.endDate}</p>
                                <p><strong>Magnitude:</strong> {query.minMagnitude} - {query.maxMagnitude}</p>
                                <p><strong>Depth:</strong> {query.minDepth} - {query.maxDepth}</p>
                                <p><strong>Latitude:</strong> {query.northCoord}</p>
                                <p><strong>Longitude:</strong> {query.westCoord}</p>
                                <p><strong>Prediction:</strong> {query.predictionResult}</p>
                            </div>
                        ))
                    ) : (
                        <p>No history yet. Click 'Get Events' to save the current query.</p>
                    )}
                </Popover.Body>
            </Popover>
        </Overlay>
    );
};

export default HistoryPopover;
