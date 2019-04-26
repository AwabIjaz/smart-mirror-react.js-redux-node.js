import cloudinary.api
import urllib.request
import argparse
import pickle
import cv2
import face_recognition


cloudinary.config(
  cloud_name = 'dgq7bff58',  
  api_key = '859866388255326',  
  api_secret = 'sIaIoVREaUl0BLC036CZshoSs_o'  
)

r = cloudinary.api.resources(resource_type='raw')


if not r['resources']:
        print("no model exist")
else:
        #print("model exist")
        filedata = urllib.request.urlopen(r['resources'][0]['url'])
        datatowrite = filedata.read()
        with open('/app/routes/python/face/encodings.pickle', 'wb') as f:  
            f.write(datatowrite)
        # construct the argument parser and parse the arguments
        ap = argparse.ArgumentParser()
        ap.add_argument("-e", "--encodings", default='/app/routes/python/face/encodings.pickle',
                help="path to serialized db of facial encodings")
        ap.add_argument("-i", "--image", required="true",
                help="path to input image")
        ap.add_argument("-d", "--detection-method", type=str, default="hog",
                help="face detection model to use: either `hog` or `cnn`")
        args = vars(ap.parse_args())

        # load the known faces and embeddings
        #commented print("[INFO] loading encodings...")
        data = pickle.loads(open(args["encodings"], "rb").read())

        # load the input image and convert it from BGR to RGB
        image = cv2.imread(args["image"])
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # detect the (x, y)-coordinates of the bounding boxes corresponding
        # to each face in the input image, then compute the facial embeddings
        # for each face
        #commented print("[INFO] recognizing faces...")
        boxes = face_recognition.face_locations(rgb,
                model=args["detection_method"])
        encodings = face_recognition.face_encodings(rgb, boxes)

        # initialize the list of names for each face detected
        names = []
        if not boxes:
                print('no user')
        else:
                # loop over the facial embeddings
                for encoding in encodings:
                        # attempt to match each face in the input image to our known
                        # encodings
                        matches = face_recognition.compare_faces(data["encodings"],
                                encoding, tolerance=0.5)
                        name = "Unknown"
                        # check to see if we have found a match
                        if True in matches:
                                # find the indexes of all matched faces then initialize a
                                # dictionary to count the total number of times each face
                                # was matched
                                matchedIdxs = [i for (i, b) in enumerate(matches) if b]
                                counts = {}

                                # loop over the matched indexes and maintain a count for
                                # each recognized face face
                                for i in matchedIdxs:
                                        name = data["names"][i]
                                        counts[name] = counts.get(name, 0) + 1

                                # determine the recognized face with the largest number of
                                # votes (note: in the event of an unlikely tie Python will
                                # select first entry in the dictionary)
                                name = max(counts, key=counts.get)
                        
                        # update the list of names
                        names.append(name)
                        print(name)
