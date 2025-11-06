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
                <Popover.Header as="h3">기록</Popover.Header>
                <Popover.Body className="history-popover-body">
                    {queryHistory.length > 0 ? (
                        queryHistory.map((query, index) => (
                            <div key={index} className="history-item">
                                <p><strong>결과 {index + 1}:</strong></p>
                                <p><strong>날짜:</strong> {query.startDate}</p>
                                <p><strong>규모:</strong> {query.minMagnitude}</p>
                                <p><strong>깊이:</strong> {query.depth}</p>
                                <p><strong>위도:</strong> {query.northCoord}</p>
                                <p><strong>경도:</strong> {query.westCoord}</p>
                                <p><strong>예측:</strong> {query.predictionResult}</p>
                            </div>
                        ))
                    ) : (
                        <p>아직 기록이 없습니다. '결과 보기'를 클릭하여 현재 쿼리를 저장하세요.</p>
                    )}
                </Popover.Body>
            </Popover>
        </Overlay>
    );
};

export default HistoryPopover;
