import os
import openai
import math
from dotenv import load_dotenv
from pydub import AudioSegment

load_dotenv()

WHISPER_API_KEY = os.environ.get('WHISPER_API_KEY')
model_id = 'whisper-1'

media_file_path = 'audio2.mp3'
audio_extension = media_file_path.split('.')[-1]
media_file = AudioSegment.from_mp3(media_file_path)

one_second = 1000
one_minute = 60 * 1000
ten_minutes = 60 * 1000 * 10

total_duration_seconds = round(media_file.duration_seconds + 1)
total_duration_milliseconds = total_duration_seconds * 1000

num_chunks = math.ceil(total_duration_milliseconds / ten_minutes)

chunk_unit = ten_minutes

# split the audio file into ten-minute chunks
for indx, audio_segment in enumerate(range(0, total_duration_milliseconds, chunk_unit)):
    media_file[audio_segment:audio_segment+chunk_unit].export(str(indx + 1) + '.' + audio_extension, format=audio_extension)

transcription = open('transcription.txt', 'a+')

# send each chunk to whisper api
for i in range(num_chunks):
    prompt = transcription.read()

    if prompt == "":
        prompt = prompt + "Sure, I'll whisper to you a secret: I hid the treasure in the old oak tree, but beware of the mischievous squirrels!"

    filename = str(i+1) + '.' + audio_extension

    with open(filename, 'rb') as audio_file:
        response = openai.Audio.transcribe(
            api_key=WHISPER_API_KEY,
            model=model_id,
            file=audio_file,
            prompt=prompt
        )
        transcription.write(response.data['text'])