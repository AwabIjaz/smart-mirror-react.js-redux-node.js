from os import path
import sys
import requests
import json
import speech_recognition as sr

# Wit speech API endpoint
API_ENDPOINT = 'https://api.wit.ai/message?v=20170307&q='
 
# Wit.ai api access token
wit_access_token = '2C2LGRSCVA6MQ2K53XCPBWMD52A4XSLF'

r = sr.Recognizer()
#usb_mic = sr.Microphone.list_microphone_names().index("usb_mic")
#mic = sr.Microphone(device_index=usb_mic)
mic = sr.Microphone()
with mic as source:
    r.adjust_for_ambient_noise(source,0.5)
    #print('say')
    audio = r.record(source, duration=5)
    #print('over')

def getIntent(text):
    # defining headers for HTTP request
    headers = {'authorization': 'Bearer ' + wit_access_token}
    # making an HTTP post request
    resp = requests.post(API_ENDPOINT + text, headers = headers)
    # converting response content to JSON format
    #strnobytesissue data = json.loads(resp.content)
    data = json.loads(resp.content.decode('utf-8'))
    # get text from data
    
    if 'intent' in data['entities']:
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
        elif(intent == 'create_alarm'):
            print(data['entities'])
            print(data['entities']['datetime'][0]['value'])
    else:
        print('command not found')
try:
    googleText = r.recognize_google(audio)
    if googleText == 'login' or googleText == 'log in' or googleText == 'signin' or googleText == 'sign in':
        print(googleText)
        print("command")
        print("login")
    elif googleText == 'logout' or googleText == 'log out' or googleText == 'signout' or googleText == 'sign out':
        print(googleText)
        print("command")
        print("logout")
    else:
        print(googleText)
        getIntent(googleText)
    sys.stdout.flush()
except sr.UnknownValueError:
    #dataa = {
    #    "text": "Google Speech Recognition could not understand audio"
    #}
    #print(dataa)
    print('error')
    print('couldnt understand you')
except sr.RequestError as e:
    #print("Could not request results from Google Speech Recognition service; {0}".format(e))
    print("Network error")

