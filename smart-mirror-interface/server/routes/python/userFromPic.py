from picamera import PiCamera
from time import sleep

import requests
import json

camera = PiCamera()
camera.rotation = 180
camera.resolution = (640,480)
sleep(0.5)
camera.capture('/home/pi/porc/sm/server/routes/python/my.png')
camera.close()

##files = open('my.png','rb').read()

files = {'file': open('/home/pi/porc/sm/server/routes/python/my.png', 'rb')}
r = requests.post('https://apes427.herokuapp.com/face', files = files)
data = json.loads(r.content.decode('utf-8'))
print(data)
