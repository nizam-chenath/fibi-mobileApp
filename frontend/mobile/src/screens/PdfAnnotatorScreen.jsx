// screens/PdfAnnotatorScreen.jsx
import React, { useRef, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../hooks/useTheme.jsx';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';
import { PDFDocument } from 'pdf-lib';
import { Buffer } from 'buffer';

const PdfAnnotatorScreen = ({ onBack, photo }) => {
  const theme = useTheme();
  const [pdfUri, setPdfUri] = useState(null); // file:/// path
  const [savedUri, setSavedUri] = useState(null);
  const [imgW, setImgW] = useState(photo?.width ? Math.min(200, photo.width) : 200);
  const [imgH, setImgH] = useState(photo?.height ? Math.min(200, photo.height) : 200);
  const [posX, setPosX] = useState(40);
  const [posY, setPosY] = useState(40);
  const pdfViewRef = useRef(null);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    title: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
    canvas: { flex: 1, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
    controls: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
    btn: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
    btnText: { fontWeight: '700', color: theme.colors.text },
    overlay: { position: 'absolute', borderWidth: 1, borderColor: theme.colors.primary + '66', backgroundColor: '#00000010' },
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
      setPdfUri(localUri);
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
    setPosX((x) => Math.max(0, x + dx));
    setPosY((y) => Math.max(0, y + dy));
  };

  const saveToPdf = async () => {
    if (!pdfUri || !photo?.uri) {
      Alert.alert('Missing file', 'Please choose a PDF and capture a photo first.');
      return;
    }
    try {
      // Read PDF as base64 (support content:// via BlobUtil)
      const pdfBase64 = await readFileBase64(pdfUri);
      const pdfBytes = Buffer.from(pdfBase64, 'base64');
      const doc = await PDFDocument.load(pdfBytes);
      const page = doc.getPage(0);

      // Read image as base64 (support content://)
      const imgBase64 = await readFileBase64(photo.uri);
      const isPng = (photo.type || '').includes('png') || (photo.fileName || '').toLowerCase().endsWith('.png');
      const embedded = isPng ? await doc.embedPng(Buffer.from(imgBase64, 'base64')) : await doc.embedJpg(Buffer.from(imgBase64, 'base64'));

      // pdf-lib uses bottom-left origin. We approximate page size; place based on current overlay box.
      const { width: pageW, height: pageH } = page.getSize();

      // We don't know the pixel-to-point mapping of the preview; assume the preview fills width.
      // Map overlay X,Y proportionally using the current view size if available.
      // Fallback: use proportional placement by screen width.
      const screenW = Dimensions.get('window').width - 32; // container padding ~16*2
      const viewW = screenW - 2; // approx after borders
      const scaleX = pageW / viewW;
      const scaleY = pageW / viewW; // keep aspect ratio mapping for simplicity

      const drawW = imgW * scaleX;
      const drawH = imgH * scaleY;
      const drawX = posX * scaleX;
      const drawY = pageH - (posY * scaleY) - drawH; // invert Y

      const page1 = doc.getPage(0);
      page1.drawImage(embedded, { x: drawX, y: drawY, width: drawW, height: drawH });

      const outBytes = await doc.save();
      const outBase64 = Buffer.from(outBytes).toString('base64');
      const dir = `${RNFS.DocumentDirectoryPath}/Fibi`;
      await RNFS.mkdir(dir);
      const outPath = `${dir}/annotated-${Date.now()}.pdf`;
      await RNFS.writeFile(outPath, outBase64, 'base64');
      setSavedUri('file://' + outPath);
      Alert.alert('Saved', 'Annotated PDF saved.');
    } catch (e) {
      Alert.alert('Save failed', e?.message || 'Unknown error');
    }
  };

  // Simple drag controls (buttons) to avoid complex gesture setup for now
  const MoveButton = ({ icon, dx = 0, dy = 0 }) => (
    <TouchableOpacity className="move" style={styles.btn} onPress={() => onDrag(dx, dy)}>
      <Icon name={icon} size={16} color={theme.colors.text} />
      <Text style={styles.btnText}>Move</Text>
    </TouchableOpacity>
  );

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
        <TouchableOpacity style={styles.btn} onPress={() => setImgW((w) => w + 20) || setImgH((h) => h + 20)}>
          <Icon name="add" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Bigger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => { setImgW((w) => Math.max(20, w - 20)); setImgH((h) => Math.max(20, h - 20)); }}>
          <Icon name="remove" size={16} color={theme.colors.text} />
          <Text style={styles.btnText}>Smaller</Text>
        </TouchableOpacity>
        <MoveButton icon="arrow-up-outline" dy={-10} />
        <MoveButton icon="arrow-down-outline" dy={10} />
        <MoveButton icon="arrow-back-outline" dx={-10} />
        <MoveButton icon="arrow-forward-outline" dx={10} />
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

      <View style={styles.canvas}>
        {pdfUri ? (
          <View style={{ flex: 1 }}>
            <Pdf
              ref={pdfViewRef}
              source={{ uri: pdfUri }}
              style={{ flex: 1 }}
              onError={(e) => Alert.alert('PDF error', e?.message || String(e))}
            />
            {!!photo?.uri && (
              <View
                pointerEvents="none"
                style={[styles.overlay, { left: posX, top: posY, width: imgW, height: imgH }]} />
            )}
            <Text style={styles.hint}>Tip: Use arrow buttons to position and +/- to resize, then Save.</Text>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.textSecondary }}>Choose a PDF to start</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PdfAnnotatorScreen;
