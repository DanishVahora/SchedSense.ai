from fastapi import FastAPI, File, UploadFile
import speech_recognition as sr
import tempfile

app = FastAPI()

@app.post("/api/speech-to-text/")
async def speech_to_text(audio: UploadFile = File(...)):
    # Save uploaded audio to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(await audio.read())
        temp_audio_path = temp_audio.name

    recognizer = sr.Recognizer()
    with sr.AudioFile(temp_audio_path) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            text = "Could not understand audio"
        except sr.RequestError:
            text = "Speech recognition service unavailable"

    

    return {"transcript": text}