import React, { useState } from "react";
import { Button, StatusBar, StyleSheet, Text, View } from "react-native";
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

  function getDurationFormatted(millis: number): string {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines(){

    return recordings.map((recordingLine, index) => {
        return(
            <View key={index} style = {styles.row}>
                <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
                <Button onPress={() => recordingLine.sound.replayAsync()} title={"Play"}></Button>
            </View>
        )
    })
  }



  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>

      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}

      <StatusBar />
    </View>
  );
};

export default RecordingScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
   },
   row:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
   },
   fill:{
    flex: 1,
    margin:10
   },

   button:{

    margin: 10
   },
  message: { marginBottom: 8 },
});