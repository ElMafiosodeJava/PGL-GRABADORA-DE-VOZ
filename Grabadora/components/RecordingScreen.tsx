import React, { useState } from "react";
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView, 
} from "react-native";
import { Audio } from "expo-av";

type RecordingItem = {
  sound: Audio.Sound;
  duration: string;
  file: string | null;
};

const RecordingScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [message, setMessage] = useState<string>("");

  async function startRecording() {
    try {
      setMessage("");

      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        setMessage("Please grant permission to app to access microphone");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording", error);
      setMessage("Failed to start recording");
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      const currentRecording = recording;

      await currentRecording.stopAndUnloadAsync();

      const { sound, status } =
        await currentRecording.createNewLoadedSoundAsync();

      const durationMillis = status.isLoaded ? (status.durationMillis ?? 0) : 0;

      setRecordings((prev) => [
        ...prev,
        {
          sound,
          duration: getDurationFormatted(durationMillis),
          file: currentRecording.getURI(),
        },
      ]);

      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording", error);
      setMessage("Failed to stop recording");
      setRecording(null);
    }
  }

  async function deleteRecording(index: number) {
    try {
      const item = recordings[index];
      if (item?.sound) await item.sound.unloadAsync();
    } catch {}
    setRecordings((prev) => prev.filter((_, i) => i !== index));
  }

  async function clearAllRecordings() {
    try {
      for (const r of recordings) {
        try {
          await r.sound.unloadAsync();
        } catch {}
      }
    } finally {
      setRecordings([]);
    }
  }

  function getDurationFormatted(millis: number): string {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>

          <View style={styles.buttonWrap}>
            <Button
              onPress={() => recordingLine.sound.replayAsync()}
              title={"Play"}
            />
          </View>

          <View style={styles.buttonWrap}>
            <Button onPress={() => deleteRecording(index)} title={"Delete"} />
          </View>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>

      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />

      {recording ? <Text style={styles.recordingIndicator}>● Recording...</Text> : null}

      {recordings.length > 0 ? (
        <View style={styles.clearAllWrap}>
          <Button title="Delete all" onPress={clearAllRecordings} />
        </View>
      ) : null}

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {getRecordingLines()}
      </ScrollView>

      <StatusBar />
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16, 
  },
  list: {
    alignSelf: "stretch",
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  fill: {
    flex: 1,
    margin: 10,
  },
  buttonWrap: {
    margin: 6,
  },
  clearAllWrap: {
    marginTop: 10,
  },
  recordingIndicator: {
    marginTop: 8,
    marginBottom: 8,
  },
  message: { marginBottom: 8 },
});