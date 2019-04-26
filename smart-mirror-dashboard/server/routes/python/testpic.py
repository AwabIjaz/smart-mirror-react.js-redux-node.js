
import requests
import json


files = {'file': open('C:/Users/legolas/Desktop/FYP/sm-pi/server/routes/python/my.png', 'rb')}
r = requests.post('https://apes427.herokuapp.com/face', files = files)
data = json.loads(r.content.decode('utf-8'))
print(data)
