import requests
import json
import cv2

cam = cv2.VideoCapture(0)

ret, frame = cam.read()
cam.release()

image = frame
rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

cv2.imwrite("C:/Users/AWAB/Desktop/sm-rpi/server/routes/python/my.png", image)

files = {'file': open('C:/Users/AWAB/Desktop/sm-rpi/server/routes/python/my.png', 'rb')}
r = requests.post('https://apes427.herokuapp.com/face', files = files)
data = json.loads(r.content.decode('utf-8'))
print(data)
