import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer } from "expo-sensors"; 

type StoredRecording = {
  uri: string;
  durationMillis: number;
};

type RecordingItem = {
  sound: Audio.Sound;
  duration: string;
  file: string;
  durationMillis: number;
};

const STORAGE_KEY = "PGL_SOUNDRECORDER_URIS";

const LoadingIndicator = ({ label }: { label: string }) => {
  return (
    <View style={styles.loaderWrap}>
      <ActivityIndicator />
      <Text style={styles.loaderText}>{label}</Text>
    </View>
  );
};

const RecordingScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [message, setMessage] = useState<string>("");

  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isRecordingBusy, setIsRecordingBusy] = useState<boolean>(false);

  const [accel, setAccel] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingInitial(true);

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const stored: StoredRecording[] = JSON.parse(raw);

        const loaded: RecordingItem[] = [];
        for (const item of stored) {
          const { sound } = await Audio.Sound.createAsync({ uri: item.uri });
          loaded.push({
            sound,
            file: item.uri,
            durationMillis: item.durationMillis,
            duration: getDurationFormatted(item.durationMillis),
          });
        }

        setRecordings(loaded);
      } catch (e) {
        console.error("Failed to load recordings from storage", e);
      } finally {
        setIsLoadingInitial(false);
      }
    })();
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(500);

    const sub = Accelerometer.addListener((data) => {
      setAccel({ x: data.x ?? 0, y: data.y ?? 0, z: data.z ?? 0 });
    });

    return () => {
      sub.remove();
    };
  }, []);

  async function persistRecordings(next: RecordingItem[]) {
    const payload: StoredRecording[] = next.map((r) => ({
      uri: r.file,
      durationMillis: r.durationMillis,
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  async function startRecording() {
    try {
      setMessage("");
      setIsRecordingBusy(true);

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
    } finally {
      setIsRecordingBusy(false);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      setIsRecordingBusy(true);

      const currentRecording = recording;

      await currentRecording.stopAndUnloadAsync();

      const { sound, status } =
        await currentRecording.createNewLoadedSoundAsync();

      const durationMillis = status.isLoaded ? (status.durationMillis ?? 0) : 0;
      const uri = currentRecording.getURI();

      if (!uri) {
        setMessage("Recording saved but URI was null");
        setRecording(null);
        return;
      }

      const nextItem: RecordingItem = {
        sound,
        duration: getDurationFormatted(durationMillis),
        file: uri,
        durationMillis,
      };

      setRecordings((prev) => {
        const next = [...prev, nextItem];
        persistRecordings(next).catch(() => {});
        return next;
      });

      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording", error);
      setMessage("Failed to stop recording");
      setRecording(null);
    } finally {
      setIsRecordingBusy(false);
    }
  }

  async function deleteRecording(index: number) {
    try {
      const item = recordings[index];
      if (item?.sound) await item.sound.unloadAsync();
    } catch {}

    setRecordings((prev) => {
      const next = prev.filter((_, i) => i !== index);
      persistRecordings(next).catch(() => {});
      return next;
    });
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
      await AsyncStorage.removeItem(STORAGE_KEY);
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

      {isLoadingInitial ? <LoadingIndicator label="Loading recordings..." /> : null}
      {isRecordingBusy ? <LoadingIndicator label="Working..." /> : null}

      <Text style={styles.sensorText}>
        Accel x:{accel.x.toFixed(2)} y:{accel.y.toFixed(2)} z:{accel.z.toFixed(2)}
      </Text>

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

  loaderWrap: {
    marginTop: 10,
    alignItems: "center",
  },
  loaderText: {
    marginTop: 6,
  },

  sensorText: {
    marginTop: 10,
  },
});