import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stage, Layer, Circle, Line, Path, Text } from 'react-konva';
import styles from './CostumeEditor.module.css';

const CostumeEditor = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Sweatshirt');

  const parts = {
    'Sweatshirt': ['Hood', 'Collar', 'Center', 'Sleeves', 'Pockets', 'Cuffs', 'Hem'],
    'Pants': ['Waistband', 'Pockets', 'Legs', 'Cuffs']
  };

  const [points, setPoints] = useState([]);
  const [fillColor, setFillColor] = useState('rgba(0, 128, 255, 0.3)');
  const [customClose, setCustomClose] = useState([]);
  const [fillEnabled, setFillEnabled] = useState(false);

  const addPoint = (e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const handleOffset = 40;
    const newPoint = {
      x: pointer.x,
      y: pointer.y,
      handleLeft: { x: pointer.x - handleOffset, y: pointer.y },
      handleRight: { x: pointer.x + handleOffset, y: pointer.y },
      useCurve: true
    };
    setPoints([...points, newPoint]);
  };

  const toggleCurve = (index) => {
    const newPoints = [...points];
    newPoints[index].useCurve = !newPoints[index].useCurve;
    setPoints(newPoints);
  };

  const handleDragMove = (e, index, mode) => {
    const { x, y } = e.target.position();
    if (mode === 'anchor') {
      const p = points[index];
      const dx = x - p.x;
      const dy = y - p.y;
      updatePoint(index, {
        x,
        y,
        handleLeft: { x: p.handleLeft.x + dx, y: p.handleLeft.y + dy },
        handleRight: { x: p.handleRight.x + dx, y: p.handleRight.y + dy },
      });
    } else {
      updateHandle(index, mode === 'handle-left' ? 'handleLeft' : 'handleRight', { x, y });
    }
  };

  const updatePoint = (index, updated) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], ...updated };
    setPoints(newPoints);
  };

  const updateHandle = (index, side, pos) => {
    const newPoints = [...points];
    newPoints[index][side] = pos;
    setPoints(newPoints);
  };

  const handleUndo = () => {
    const newPoints = [...points];
    newPoints.pop();
    setPoints(newPoints);
    setCustomClose([]);
  };

  const handleClear = () => {
    setPoints([]);
    setCustomClose([]);
    setFillEnabled(false);
  };

  const handleCustomClose = () => {
    if (points.length >= 2) {
      setCustomClose([0, points.length - 1]);
    }
  };

  const handleToggleFill = () => {
    if (customClose.length === 2) {
      setFillEnabled(true);
    }
  };

  const buildPath = () => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (curr.useCurve) {
        d += ` C ${prev.handleRight.x} ${prev.handleRight.y}, ${curr.handleLeft.x} ${curr.handleLeft.y}, ${curr.x} ${curr.y}`;
      } else {
        d += ` L ${curr.x} ${curr.y}`;
      }
    }
    if (customClose.length === 2) {
      const [startIdx, endIdx] = customClose;
      const start = points[endIdx];
      const end = points[startIdx];
      if (end.useCurve) {
        d += ` C ${start.handleRight.x} ${start.handleRight.y}, ${end.handleLeft.x} ${end.handleLeft.y}, ${end.x} ${end.y}`;
      } else {
        d += ` L ${end.x} ${end.y}`;
      }
      if (fillEnabled) {
        d += ' Z';
      }
    }
    return d;
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        <div className={`col-12 col-lg-9 ${styles.previewArea}`}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <Stage
              width={800}
              height={600}
              onClick={(e) => {
                if (e.target === e.target.getStage()) addPoint(e);
              }}
              style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
            >
              <Layer>
                <Path
                  data={buildPath()}
                  fill={fillEnabled ? fillColor : ''}
                  stroke="black"
                  strokeWidth={2}
                />

                {points.map((p, i) => (
                  <React.Fragment key={i}>
                    <Text
                      x={p.x + 8}
                      y={p.y - 20}
                      text={`#${i}`}
                      fontSize={12}
                      fill="black"
                    />
                    <Line
                      points={[p.handleLeft.x, p.handleLeft.y, p.x, p.y]}
                      stroke="gray"
                      dash={[4, 4]}
                    />
                    <Line
                      points={[p.x, p.y, p.handleRight.x, p.handleRight.y]}
                      stroke="gray"
                      dash={[4, 4]}
                    />
                    <Circle
                      x={p.handleLeft.x}
                      y={p.handleLeft.y}
                      radius={4}
                      fill="lightblue"
                      draggable
                      onDragMove={(e) => handleDragMove(e, i, 'handle-left')}
                    />
                    <Circle
                      x={p.handleRight.x}
                      y={p.handleRight.y}
                      radius={4}
                      fill="lightblue"
                      draggable
                      onDragMove={(e) => handleDragMove(e, i, 'handle-right')}
                    />
                    <Circle
                      x={p.x}
                      y={p.y}
                      radius={6}
                      fill={p.useCurve ? 'blue' : 'orange'}
                      draggable
                      onClick={() => toggleCurve(i)}
                      onDragMove={(e) => handleDragMove(e, i, 'anchor')}
                    />
                  </React.Fragment>
                ))}
              </Layer>
            </Stage>

            <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
              <button className="btn btn-outline-secondary btn-sm" onClick={handleUndo}>
                Undo Point
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>
                Clear All
              </button>
              <button className="btn btn-outline-success btn-sm" onClick={handleCustomClose}>
                Close Path
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={handleToggleFill}>
                Fill Shape
              </button>
              <label className="ms-2 small">Fill:</label>
              <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="form-control form-control-color"
                style={{ width: '3rem', height: '2rem', padding: 0 }}
              />
            </div>
          </div>
        </div>

        <div className={`col-12 col-lg-3 p-3 d-flex flex-column ${styles.editorPanel}`}>
          <h6 className="mb-3 text-center">{t('CostumeEditor')}</h6>

          <ul className="nav nav-tabs justify-content-center mb-3">
            {Object.keys(parts).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {t(tab)}
                </button>
              </li>
            ))}
          </ul>

          <div id="editor-menu" className="row g-2 flex-grow-1 overflow-auto">
            {parts[activeTab].map((element, eIdx) => (
              <div className="col-12" key={eIdx}>
                <label className="form-label small mb-1">{t(element)}</label>
                <input type="color" className="form-control form-control-color mb-1 w-100" />
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary btn-sm px-2">&larr;</button>
                  <button className="btn btn-outline-secondary btn-sm px-2">&rarr;</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 d-flex justify-content-between">
            <button className="btn btn-outline-warning fw-bold px-4 py-2">{t('Reset')}</button>
            <button className="btn btn-outline-warning fw-bold px-4 py-2">{t('Order')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumeEditor;