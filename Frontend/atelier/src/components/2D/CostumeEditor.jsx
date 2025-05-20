import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stage, Layer, Circle, Line } from 'react-konva';
import styles from './CostumeEditor.module.css';

const CostumeEditor = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Sweatshirt');

  const parts = {
    'Sweatshirt': ['Hood', 'Collar', 'Center', 'Sleeves', 'Pockets', 'Cuffs', 'Hem'],
    'Pants': ['Waistband', 'Pockets', 'Legs', 'Cuffs']
  };

  const [points, setPoints] = useState([]);
  const [lines, setLines] = useState([]);
  const [connectingIndex, setConnectingIndex] = useState(null);
  const [closedShapes, setClosedShapes] = useState([]);
  const [fillColor, setFillColor] = useState('rgba(0, 128, 255, 0.3)');

  const addPoint = (e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    setPoints([...points, pointer]);
  };

  const handlePointClick = (index) => {
    if (connectingIndex === null) {
      setConnectingIndex(index);
    } else if (connectingIndex !== index) {
      const newLines = [...lines, [connectingIndex, index]];

      // Проверка на замкнутость: возвращение к начальной точке
      if (index === 0) {
        const shapeIndices = newLines.map(([start]) => start).concat(0);
        const unique = [...new Set(shapeIndices)];
        if (unique.length >= 3) {
          setClosedShapes([...closedShapes, unique]);
        }
      }

      setLines(newLines);
      setConnectingIndex(null);
    } else {
      setConnectingIndex(null);
    }
  };

  const handleDragMove = (e, index) => {
    const newPoints = [...points];
    newPoints[index] = {
      x: e.target.x(),
      y: e.target.y()
    };
    setPoints(newPoints);
  };

  const handleUndo = () => {
    if (points.length === 0) return;
    const newPoints = [...points];
    const removedIndex = newPoints.length - 1;
    newPoints.pop();
    setPoints(newPoints);
    setLines(lines.filter(([start, end]) => start !== removedIndex && end !== removedIndex));
    setClosedShapes(closedShapes.filter(shape => !shape.includes(removedIndex)));
    if (connectingIndex === removedIndex) setConnectingIndex(null);
  };

  const handleClear = () => {
    setPoints([]);
    setLines([]);
    setClosedShapes([]);
    setConnectingIndex(null);
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
                {/* Заливка замкнутых фигур */}
                {closedShapes.map((shape, i) => (
                  <Line
                    key={`fill-${i}`}
                    points={shape.map(idx => [points[idx]?.x, points[idx]?.y]).flat()}
                    closed
                    fill={fillColor}
                    stroke="none"
                  />
                ))}

                {/* Линии */}
                {lines.map(([start, end], i) => (
                  <Line
                    key={i}
                    points={[
                      points[start]?.x ?? 0,
                      points[start]?.y ?? 0,
                      points[end]?.x ?? 0,
                      points[end]?.y ?? 0
                    ]}
                    stroke="black"
                    strokeWidth={2}
                  />
                ))}

                {/* Точки */}
                {points.map((point, i) => (
                  <Circle
                    key={i}
                    x={point.x}
                    y={point.y}
                    radius={6}
                    fill={connectingIndex === i ? "red" : "blue"}
                    draggable
                    onClick={() => handlePointClick(i)}
                    onDragMove={(e) => handleDragMove(e, i)}
                  />
                ))}
              </Layer>
            </Stage>

            {/* Панель управления */}
            <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
              <button className="btn btn-outline-secondary btn-sm" onClick={handleUndo}>
                Undo Point
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>
                Clear All
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
