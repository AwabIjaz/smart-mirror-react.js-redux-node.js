import cloudinary
import cloudinary.uploader
import argparse
import urllib.request
import numpy as np
import cv2
import face_recognition
import pickle


#from imutils import paths

#import cloudinary.api
#import json
#import os



cloudinary.config(
  cloud_name = 'dgq7bff58',  
  api_key = '859866388255326',  
  api_secret = 'sIaIoVREaUl0BLC036CZshoSs_o'  
)


r = cloudinary.api.resources(type = "upload", tags='true')

def url_to_image(url):
	# download the image, convert it to a NumPy array, and then read
	# it into OpenCV format
	resp = urllib.request.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype="uint8")
	image = cv2.imdecode(image, cv2.IMREAD_COLOR)
	# return the image
	return image

urls = []
tags = []

for x in r['resources']:
        urls.append(x['url'])
        tags.append(x['tags'][0])

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-e", "--encodings", default="/app/routes/python/face/encodings.pickle",
	help="path to serialized db of facial encodings")
ap.add_argument("-d", "--detection-method", type=str, default="hog",
	help="face detection model to use: either `hog` or `cnn`")
args = vars(ap.parse_args())


# initialize the list of known encodings and known names
knownEncodings = []
knownNames = []

k = 0;

for i in urls:
    name = tags[k]
    image = url_to_image(i)
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb,
		model=args["detection_method"])
    encodings = face_recognition.face_encodings(rgb, boxes)
    for encoding in encodings:
            # add each encoding + name to our set of known names and
            # encodings
            knownEncodings.append(encoding)
            knownNames.append(name)
    k+=1


# dump the facial encodings + names to disk
#print("[INFO] serializing encodings...")
data = {"encodings": knownEncodings, "names": knownNames}
f = open(args["encodings"], "wb")
f.write(pickle.dumps(data))
f.close()

r = cloudinary.uploader.upload("/app/routes/python/face/encodings.pickle", resource_type = "raw", use_filename="true", unique_filename="false")
print("uploaded pickle")
