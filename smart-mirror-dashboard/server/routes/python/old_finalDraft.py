import speech_recognition as sr
from os import path
import sys
import requests
import json

# Wit speech API endpoint
API_ENDPOINT = 'https://api.wit.ai/message?v=20170307&q='
 
# Wit.ai api access token
wit_access_token = '2C2LGRSCVA6MQ2K53XCPBWMD52A4XSLF'

r = sr.Recognizer()

mic = sr.Microphone()
with mic as source:
    r.adjust_for_ambient_noise(source)
    audio = r.listen(source)

def getIntent(text):
    # defining headers for HTTP request
    headers = {'authorization': 'Bearer ' + wit_access_token}
    # making an HTTP post request
    resp = requests.post(API_ENDPOINT + text, headers = headers)
    # converting response content to JSON format
    data = json.loads(resp.content)
    # get text from data
    intent=data['entities']['intent'][0]['value']
    print(intent)
    if(intent == 'play video'):
        if 'youtube_param' in data['entities']:
            print(data['entities']['youtube_param'][0]['value'])
        else:
            print(data['entities']['reminder'][0]['value'])
    elif(intent == 'expand'):
        print(data['entities']['widget_name'][0]['value'])
    elif(intent == 'create_reminder'):
        print(data['entities']['reminder'][0]['value'])
        print(data['entities']['datetime'][0]['value'])
try:
    googleText = r.recognize_google(audio)
    print(googleText)
    getIntent(googleText)
    sys.stdout.flush()
except sr.UnknownValueError:
    dataa = {
        "text": "Google Speech Recognition could not understand audio"
    }
    print(dataa)
except sr.RequestError as e:
    print("Could not request results from Google Speech Recognition service; {0}".format(e))

