import React from 'react';
import {
  HtmlLabel,
  Label,
  Connector,
  CircleSubject,
  LineSubject,
} from '@visx/annotation';
import { LinePath } from '@visx/shape';

import ExampleControls from './ExampleControls';
import findNearestDatum from './findNearestDatum';

export const orange = '#ff7e67';
export const colors = ['#000', '#68b0ab', '#006ff1'];

const Annotation = ({ width, height, compact = false }) => {
  const height2 = 700;
  return (
    <ExampleControls width={width} height={height2} compact={compact}>
      {({
        AnnotationComponent,
        annotationPosition,
        approxTooltipHeight,
        connectorType,
        data,
        editLabelPosition,
        editSubjectPosition,
        getDate,
        getStockValue,
        horizontalAnchor,
        labelType,
        labelWidth,
        setAnnotationPosition,
        showAnchorLine,
        subjectType,
        subtitle,
        title,
        verticalAnchor,
        xScale,
        yScale,
      }) => (
        <svg width={width} height={height2}>
          <rect width={width} height={height2} fill={colors[0]} />
          <LinePath
            stroke={colors[2]}
            strokeWidth={2}
            data={data}
            x={(d) => xScale(getDate(d)) ?? 0}
            y={(d) => yScale(getStockValue(d)) ?? 0}
          />
          <AnnotationComponent
            width={width}
            height={height2}
            x={annotationPosition.x}
            y={annotationPosition.y}
            dx={annotationPosition.dx}
            dy={annotationPosition.dy}
            canEditLabel={editLabelPosition}
            canEditSubject={editSubjectPosition}
            onDragEnd={({ event, ...nextPosition }) => {
              // snap Annotation to the nearest data point
              const nearestDatum = findNearestDatum({
                accessor:
                  subjectType === 'horizontal-line' ? getStockValue : getDate,
                data,
                scale: subjectType === 'horizontal-line' ? yScale : xScale,
                value:
                  subjectType === 'horizontal-line'
                    ? nextPosition.y
                    : nextPosition.x,
              });
              const x = xScale(getDate(nearestDatum)) ?? 0;
              const y = yScale(getStockValue(nearestDatum)) ?? 0;

              // flip label to keep in view
              const shouldFlipDx =
                (nextPosition.dx > 0 &&
                  x + nextPosition.dx + labelWidth > width) ||
                (nextPosition.dx < 0 && x + nextPosition.dx - labelWidth <= 0);
              const shouldFlipDy = // 100 is est. tooltip height
                (nextPosition.dy > 0 &&
                  height2 - (y + nextPosition.dy) < approxTooltipHeight) ||
                (nextPosition.dy < 0 &&
                  y + nextPosition.dy - approxTooltipHeight <= 0);
              setAnnotationPosition({
                x,
                y,
                dx: (shouldFlipDx ? -1 : 1) * nextPosition.dx,
                dy: (shouldFlipDy ? -1 : 1) * nextPosition.dy,
              });
            }}
          >
            <Connector stroke={orange} type={connectorType} />
            {labelType === 'svg' ? (
              <Label
                backgroundFill="white"
                showAnchorLine={showAnchorLine}
                anchorLineStroke={colors[2]}
                backgroundProps={{ stroke: colors[1] }}
                fontColor={colors[2]}
                horizontalAnchor={horizontalAnchor}
                subtitle={subtitle}
                title={title}
                verticalAnchor={verticalAnchor}
                width={labelWidth}
              />
            ) : (
              <HtmlLabel
                showAnchorLine={showAnchorLine}
                anchorLineStroke={colors[2]}
                horizontalAnchor={horizontalAnchor}
                verticalAnchor={verticalAnchor}
                containerStyle={{
                  width: labelWidth,
                  background: 'white',
                  border: `1px solid ${colors[1]}`,
                  borderRadius: 2,
                  color: colors[2],
                  fontSize: '0.55em',
                  lineHeight: '1em',
                  padding: '0 0.4em 0 1em',
                  fontWeight: 200,
                }}
              >
                <h3 style={{ margin: '1em 0 -0.5em' }}>{title}</h3>
                <p>{subtitle}</p>
              </HtmlLabel>
            )}
            {subjectType === 'circle' && <CircleSubject stroke={orange} />}
            {subjectType !== 'circle' && (
              <LineSubject
                orientation={
                  subjectType === 'vertical-line' ? 'vertical' : 'horizontal'
                }
                stroke={orange}
                min={0}
                max={subjectType === 'vertical-line' ? height2 : width}
              />
            )}
          </AnnotationComponent>
        </svg>
      )}
    </ExampleControls>
  );
};

export default Annotation;
