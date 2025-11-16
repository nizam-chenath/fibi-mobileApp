// screens/SignaturePadScreen.jsx
import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import Svg, { Path, Rect, G } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

const SignaturePadScreen = ({ onBack, onSave }) => {
  const theme = useTheme();
  const [strokes, setStrokes] = useState([]); // each stroke is array of {x,y}
  const [currentStroke, setCurrentStroke] = useState([]);
  const svgRef = useRef(null);
  const shotRef = useRef(null);
  const padRef = useRef(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          if (dragEnabled) {
            dragStartRef.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
            startOffsetRef.current = { ...offset };
          } else {
            const { locationX, locationY } = evt.nativeEvent;
            // convert to unscaled coordinates
            const x = (locationX - offset.x) / scale;
            const y = (locationY - offset.y) / scale;
            setCurrentStroke([{ x, y }]);
          }
        },
        onPanResponderMove: (evt) => {
          if (dragEnabled) {
            const dx = evt.nativeEvent.pageX - dragStartRef.current.x;
            const dy = evt.nativeEvent.pageY - dragStartRef.current.y;
            setOffset({ x: startOffsetRef.current.x + dx, y: startOffsetRef.current.y + dy });
          } else {
            const { locationX, locationY } = evt.nativeEvent;
            const x = (locationX - offset.x) / scale;
            const y = (locationY - offset.y) / scale;
            setCurrentStroke((prev) => [...prev, { x, y }]);
          }
        },
        onPanResponderRelease: () => {
          if (!dragEnabled) {
            setStrokes((prev) => (currentStroke.length ? [...prev, currentStroke] : prev));
            setCurrentStroke([]);
          }
        },
        onPanResponderTerminate: () => {
          if (!dragEnabled) {
            setStrokes((prev) => (currentStroke.length ? [...prev, currentStroke] : prev));
            setCurrentStroke([]);
          }
        },
      }),
    [currentStroke, dragEnabled, offset, scale],
  );

  const pathFromPoints = (points) => {
    if (!points || points.length === 0) return '';
    const [first, ...rest] = points;
    const moveTo = `M ${first.x} ${first.y}`;
    const lines = rest.map((p) => `L ${p.x} ${p.y}`).join(' ');
    return `${moveTo} ${lines}`;
  };

  const hasSignature = strokes.length > 0 || currentStroke.length > 0;

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  const handleSave = async () => {
    try {
      // capture as PNG base64
      const base64Png = await shotRef.current?.capture?.({
        format: 'png',
        quality: 1,
        result: 'base64',
      });
      const payload = {
        paths: [...strokes, currentStroke].filter((s) => s.length).map(pathFromPoints),
        imageBase64: base64Png ? `data:image/png;base64,${base64Png}` : null,
      };
      onSave && onSave(payload);
    } catch (e) {
      console.warn('[SignaturePad] Save failed:', e?.message || e);
      onSave && onSave(null);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.colors.text,
    },
    padWrapper: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    pad: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 12,
    },
    controlsLeft: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      flex: 1,
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    btnText: {
      color: theme.colors.text,
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Icon name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Signature Pad</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.padWrapper}>
        <ViewShot ref={shotRef} style={{ flex: 1 }} options={{ format: 'png', quality: 1 }}>
          <View style={styles.pad} ref={padRef} {...panResponder.panHandlers}>
            <Svg ref={svgRef} style={{ flex: 1 }}>
              <Rect x="0" y="0" width="100%" height="100%" fill="transparent" />
              <G transform={`translate(${offset.x},${offset.y}) scale(${scale})`}>
                {strokes.map((stroke, idx) => (
                  <Path
                    key={`stroke-${idx}`}
                    d={pathFromPoints(stroke)}
                    stroke={theme.colors.text}
                    strokeWidth={2}
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ))}
                {currentStroke.length > 0 && (
                  <Path
                    d={pathFromPoints(currentStroke)}
                    stroke={theme.colors.primary}
                    strokeWidth={2}
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
              </G>
            </Svg>
          </View>
        </ViewShot>
      </View>

      <View style={styles.controls}>
        <View style={styles.controlsLeft}>
          <TouchableOpacity style={styles.btn} onPress={() => setDragEnabled((v) => !v)}>
            <Icon name={dragEnabled ? 'hand-left-outline' : 'move-outline'} size={16} color={theme.colors.text} />
            <Text style={styles.btnText}>{dragEnabled ? 'Move: ON' : 'Move: OFF'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => setScale((s) => Math.min(3, s + 0.1))}>
            <Icon name="add" size={16} color={theme.colors.text} />
            <Text style={styles.btnText}>Scale +</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => setScale((s) => Math.max(0.5, s - 0.1))}>
            <Icon name="remove" size={16} color={theme.colors.text} />
            <Text style={styles.btnText}>Scale -</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleClear} disabled={!hasSignature}>
          <Icon name="trash-outline" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={!hasSignature}>
          <Icon name="save-outline" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignaturePadScreen;
