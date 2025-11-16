// screens/PdfAnnotatorScreen.jsx
import React, { useRef, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, PanResponder, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';
import { PDFDocument } from 'pdf-lib';
import { Buffer } from 'buffer';

const PdfAnnotatorScreen = ({ onBack, photo, signature }) => {
  const theme = useTheme();
  const [pdfUri, setPdfUri] = useState(null); // file:/// path
  const [savedUri, setSavedUri] = useState(null);
  const [canvasW, setCanvasW] = useState(0);
  const [canvasH, setCanvasH] = useState(0);
  // initialize overlay keeping aspect ratio if possible (prefer signature if present)
  const initialAspect =
    signature?.imageWidth && signature?.imageHeight
      ? signature.imageWidth / signature.imageHeight
      : photo?.width && photo?.height
        ? photo.width / photo.height
        : 3 / 1; // fallback wide signature-like
  const [imgW, setImgW] = useState(200);
  const [imgH, setImgH] = useState(Math.round(200 / initialAspect));
  const [posX, setPosX] = useState(40);
  const [posY, setPosY] = useState(40);
  const [dragEnabled, setDragEnabled] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 40, y: 40 });
  const pinchStartRef = useRef({ dist: 0, imgW: 0, imgH: 0, centerX: 0, centerY: 0, posX: 0, posY: 0 });
  const hasOverlay = !!(photo?.uri || signature?.imageBase64);
  const overlayPan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (_, gestureState) => hasOverlay && (gestureState.numberActiveTouches >= 1),
        onMoveShouldSetPanResponder: (_, gestureState) => hasOverlay && (gestureState.numberActiveTouches >= 1),
        onPanResponderGrant: (evt, gestureState) => {
          if (gestureState.numberActiveTouches >= 2) {
            const [t1, t2] = evt.nativeEvent.touches;
            const dx = t2.pageX - t1.pageX;
            const dy = t2.pageY - t1.pageY;
            const dist = Math.hypot(dx, dy);
            const centerX = (t1.locationX + t2.locationX) / 2;
            const centerY = (t1.locationY + t2.locationY) / 2;
            pinchStartRef.current = { dist, imgW, imgH, centerX, centerY, posX, posY };
          } else {
            dragStartRef.current = { x: gestureState.x0, y: gestureState.y0 };
            startPosRef.current = { x: posX, y: posY };
          }
        },
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.numberActiveTouches >= 2 && evt.nativeEvent.touches.length >= 2) {
            // Pinch to resize proportionally, keep center
            const [t1, t2] = evt.nativeEvent.touches;
            const dx = t2.pageX - t1.pageX;
            const dy = t2.pageY - t1.pageY;
            const dist = Math.hypot(dx, dy);
            const start = pinchStartRef.current;
            if (start.dist > 0) {
              const scale = dist / start.dist;
              let newW = Math.max(20, start.imgW * scale);
              let newH = Math.max(20, start.imgH * scale);
              // Clamp to canvas
              if (canvasW) newW = Math.min(newW, canvasW);
              if (canvasH) newH = Math.min(newH, canvasH);
              // Keep center constant
              const cx = start.posX + start.imgW / 2;
              const cy = start.posY + start.imgH / 2;
              let nextX = cx - newW / 2;
              let nextY = cy - newH / 2;
              const maxX = Math.max(0, canvasW - newW);
              const maxY = Math.max(0, canvasH - newH);
              nextX = Math.max(0, Math.min(nextX, maxX));
              nextY = Math.max(0, Math.min(nextY, maxY));
              setImgW(newW);
              setImgH(newH);
              setPosX(nextX);
              setPosY(nextY);
            }
          } else {
            // Drag
            const dx = gestureState.moveX - dragStartRef.current.x;
            const dy = gestureState.moveY - dragStartRef.current.y;
            const nextX = startPosRef.current.x + dx;
            const nextY = startPosRef.current.y + dy;
            const maxX = Math.max(0, canvasW - imgW);
            const maxY = Math.max(0, canvasH - imgH);
            setPosX(Math.max(0, Math.min(nextX, maxX)));
            setPosY(Math.max(0, Math.min(nextY, maxY)));
          }
        },
        onPanResponderRelease: () => {},
        onPanResponderTerminate: () => {},
      }),
    [hasOverlay, posX, posY, canvasW, canvasH, imgW, imgH],
  );
  const pdfViewRef = useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    title: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
    canvas: { flex: 1, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
    controls: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
    btn: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
    btnText: { fontWeight: '700', color: theme.colors.text },
    overlay: { position: 'absolute', borderWidth: 1, borderColor: theme.colors.primary + '66', backgroundColor: '#00000010' },
    dragOverlay: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' },
    hint: { color: theme.colors.textSecondary, marginTop: 6 },
  });

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'documentDirectory',
      });
      // Prefer local copied file path if available
      const localUri = res.fileCopyUri || res.uri;
      setSavedUri(null);
      if (localUri?.startsWith('content://')) {
        // Copy content URI into a real file we control to avoid read issues
        try {
          const base64 = await RNBlobUtil.fs.readFile(localUri, 'base64');
          const dir = `${RNFS.DocumentDirectoryPath}/Fibi`;
          await RNFS.mkdir(dir);
          const outPath = `${dir}/picked-${Date.now()}.pdf`;
          await RNFS.writeFile(outPath, base64, 'base64');
          setPdfUri('file://' + outPath);
        } catch (copyErr) {
          console.warn('[PDF] Failed to copy content URI; using original:', copyErr?.message || copyErr);
          setPdfUri(localUri);
        }
      } else {
        setPdfUri(localUri);
      }
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        Alert.alert('Pick PDF failed', e?.message || 'Unknown error');
      }
    }
  };

  const readFileBase64 = async (uri) => {
    try {
      if (!uri) return null;
      if (uri.startsWith('content://')) {
        return await RNBlobUtil.fs.readFile(uri, 'base64');
      }
      const path = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
      return await RNFS.readFile(path, 'base64');
    } catch (e) {
      // Fallback try the other reader
      try {
        if (uri && uri.startsWith('content://')) {
          const path = uri;
          return await RNFS.readFile(path, 'base64');
        } else if (uri) {
          return await RNBlobUtil.fs.readFile(uri, 'base64');
        }
      } catch {}
      throw e;
    }
  };

  const onDrag = (dx, dy) => {
    setPosX((x) => {
      const nx = x + dx;
      const maxX = Math.max(0, canvasW - imgW);
      return Math.max(0, Math.min(nx, maxX));
    });
    setPosY((y) => {
      const ny = y + dy;
      const maxY = Math.max(0, canvasH - imgH);
      return Math.max(0, Math.min(ny, maxY));
    });
  };

  const saveToPdf = async () => {
    if (!pdfUri || (!photo?.uri && !signature?.imageBase64)) {
      Alert.alert('Missing file', 'Please choose a PDF and provide a signature or photo first.');
      return;
    }
    try {
      // Read PDF as base64 (support content:// via BlobUtil)
      let pdfBase64;
      try {
        pdfBase64 = await readFileBase64(pdfUri);
        if (!pdfBase64) {
          throw new Error('Empty PDF data');
        }
      } catch (readErr) {
        console.error('[PDF] Read failed:', readErr);
        Alert.alert('Save failed', `Could not read PDF. ${readErr?.message || ''}`.trim());
        return;
      }

      let doc;
      let page;
      try {
        const pdfBytes = Buffer.from(pdfBase64, 'base64');
        doc = await PDFDocument.load(pdfBytes);
        page = doc.getPage(0);
      } catch (loadErr) {
        console.error('[PDF] Load failed:', loadErr);
        Alert.alert('Save failed', `Could not open PDF. ${loadErr?.message || ''}`.trim());
        return;
      }

      // Prepare image source (photo or signature)
      let embedded = null;
      try {
        if (signature?.imageBase64) {
          const data = signature.imageBase64.startsWith('data:')
            ? signature.imageBase64.split(',')[1]
            : signature.imageBase64;
          embedded = await doc.embedPng(Buffer.from(data, 'base64'));
        } else if (photo?.uri) {
          const imgBase64 = await readFileBase64(photo.uri);
          const isPng =
            (photo.type || '').includes('png') ||
            (photo.fileName || '').toLowerCase?.().endsWith('.png');
          embedded = isPng
            ? await doc.embedPng(Buffer.from(imgBase64, 'base64'))
            : await doc.embedJpg(Buffer.from(imgBase64, 'base64'));
        }
        if (!embedded) {
          Alert.alert('Save failed', 'No valid image to place.');
          return;
        }
      } catch (embedErr) {
        console.error('[PDF] Embed image failed:', embedErr);
        Alert.alert('Save failed', `Could not embed image. ${embedErr?.message || ''}`.trim());
        return;
      }

      // pdf-lib uses bottom-left origin. We approximate page size; place based on current overlay box.
      const { width: pageW, height: pageH } = page.getSize();

      // Map overlay coordinates from preview canvas to PDF page using actual canvas size.
      const viewW = canvasW > 0 ? canvasW : (Dimensions.get('window').width - 34); // approx if not measured
      const viewH = canvasH > 0 ? canvasH : Math.max(1, viewW * 1.3);
      const scaleX = pageW / Math.max(1, viewW);
      const scaleY = pageH / Math.max(1, viewH);

      let drawW = Math.max(1, imgW * scaleX);
      let drawH = Math.max(1, imgH * scaleY);
      let drawX = posX * scaleX;
      let drawY = pageH - (posY * scaleY) - drawH; // invert Y

      // Clamp within page bounds
      if (!Number.isFinite(drawX)) drawX = 0;
      if (!Number.isFinite(drawY)) drawY = 0;
      if (!Number.isFinite(drawW)) drawW = Math.min(100, pageW);
      if (!Number.isFinite(drawH)) drawH = Math.min(50, pageH);

      drawW = Math.min(drawW, pageW);
      drawH = Math.min(drawH, pageH);
      drawX = Math.max(0, Math.min(drawX, pageW - drawW));
      drawY = Math.max(0, Math.min(drawY, pageH - drawH));

      const page1 = doc.getPage(0);
      page1.drawImage(embedded, { x: drawX, y: drawY, width: drawW, height: drawH });

      try {
        const outBytes = await doc.save();
        const outBase64 = Buffer.from(outBytes).toString('base64');
        const dir = `${RNFS.DocumentDirectoryPath}/Fibi`;
        await RNFS.mkdir(dir);
        const outPath = `${dir}/annotated-${Date.now()}.pdf`;
        await RNFS.writeFile(outPath, outBase64, 'base64');
        setSavedUri('file://' + outPath);
        Alert.alert('Saved', 'Annotated PDF saved.');
      } catch (writeErr) {
        console.error('[PDF] Write failed:', writeErr);
        Alert.alert('Save failed', `Could not write file. ${writeErr?.message || ''}`.trim());
      }
    } catch (e) {
      console.error('[PDF] Save failed:', e);
      Alert.alert('Save failed', e?.message ? String(e.message) : 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Icon name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Annotate PDF</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={pickPdf}>
          <Icon name="document-attach-outline" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>{pdfUri ? 'Change PDF' : 'Choose PDF'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            const newW = imgW + 20;
            const aspect = imgW / Math.max(1, imgH);
            const newH = Math.round(newW / Math.max(0.1, aspect));
            // clamp if exceeding canvas
            const clampedW = canvasW ? Math.min(newW, canvasW) : newW;
            const clampedH = canvasH ? Math.min(newH, canvasH) : newH;
            setImgW(clampedW);
            setImgH(clampedH);
          }}
        >
          <Icon name="add" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Bigger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            const newW = Math.max(20, imgW - 20);
            const aspect = imgW / Math.max(1, imgH);
            const newH = Math.max(20, Math.round(newW / Math.max(0.1, aspect)));
            setImgW(newW);
            setImgH(newH);
            // also ensure position still inside bounds
            setPosX((x) => Math.min(x, Math.max(0, (canvasW || newW) - newW)));
            setPosY((y) => Math.min(y, Math.max(0, (canvasH || newH) - newH)));
          }}
        >
          <Icon name="remove" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Smaller</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={saveToPdf}>
          <Icon name="save-outline" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Save to PDF</Text>
        </TouchableOpacity>
        {savedUri && (
          <TouchableOpacity style={styles.btn} onPress={() => setPdfUri(savedUri)}>
            <Icon name="eye-outline" size={16} color={theme.colors.text} />
            <Text style={styles.btnText}>Open Saved</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={styles.canvas}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setCanvasW(width);
          setCanvasH(height);
          // when canvas measured first time, clamp overlay inside
          setPosX((x) => Math.min(x, Math.max(0, width - imgW)));
          setPosY((y) => Math.min(y, Math.max(0, height - imgH)));
        }}
      >
        {pdfUri ? (
          <View style={{ flex: 1 }}>
            <Pdf
              ref={pdfViewRef}
              source={{ uri: pdfUri }}
              style={{ flex: 1 }}
              onError={(e) => Alert.alert('PDF error', e?.message || String(e))}
            />
            {!!(photo?.uri || signature?.imageBase64) && (
              <View
                {...overlayPan.panHandlers}
                pointerEvents="auto"
                style={[
                  styles.overlay,
                  styles.dragOverlay,
                  { left: posX, top: posY, width: imgW, height: imgH },
                ]}
              >
                <Image
                  source={
                    signature?.imageBase64
                      ? { uri: signature.imageBase64 }
                      : photo?.uri
                        ? { uri: photo.uri }
                        : undefined
                  }
                  style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                />
              </View>
            )}
            <Text style={styles.hint}>Tip: Drag to move and use +/- to resize, then Save.</Text>
          </View>
        ) : (
          <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={pickPdf} activeOpacity={0.8}>
            <Text style={{ color: theme.colors.textSecondary, textDecorationLine: 'underline' }}>Choose a PDF to start</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PdfAnnotatorScreen;
