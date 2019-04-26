import speech_recognition as sr
from os import path
import sys


r = sr.Recognizer()

mic = sr.Microphone()
with mic as source:
    audio = r.listen(source)



try:
    print(r.recognize_wit(audio, '2C2LGRSCVA6MQ2K53XCPBWMD52A4XSLF'))
    sys.stdout.flush()
except sr.UnknownValueError:
    print("Google Speech Recognition could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Google Speech Recognition service; {0}".format(e))
