import argparse
from argparse import Namespace
import detect
import pandas as pd
import os
import pymysql
import json
import sys
import cv2

LIMIT_PX = 2000

db = pymysql.connect(
    user="admin",
    host="db-catchinichi.coagfxdx9ff4.ap-northeast-2.rds.amazonaws.com",
    port=3306,
    password="Password!23",
    database="catchiNichi",
    charset="utf8",
)
cursor = db.cursor(pymysql.cursors.DictCursor)

sql = "SELECT * FROM fragrances"
cursor.execute(sql)
frag_dict = cursor.fetchall()
frag_data = pd.DataFrame(frag_dict)

abs_path = os.path.dirname(os.path.realpath(__file__))

# frag_data = pd.read_csv("label_recog/fragrance.csv")

frag_data.drop(
    ["kr_brand", "kr_name", "img", "category", "likes", "countingReview", "avgStars"],
    axis=1,
    inplace=True,
)

frag_data["brand"] = frag_data["brand"].str.replace(" ", "")
frag_data["en_name"] = frag_data["en_name"].str.replace(" ", "")


def search_brand(brand):
    if brand == "s.marianovella":
        return frag_data[frag_data["brand"] == "santamarianovella"]
    return frag_data[frag_data["brand"] == brand]


def detect_text(path):
    """Detects text in the file."""
    from google.cloud import vision
    import io

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(
        abs_path, "jiho-cred.json"
    )
    result = ""
    client = vision.ImageAnnotatorClient()

    with io.open(path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    try:
        result = texts[0].description        
    except:
        pass
    return result

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )


def classifier(text, img_dir):
    nichis = [
        "byredo",
        "masionmargiela",
        "diptyque",
        "jomalone",
        "creed",
        "acquadiparma",
        "s.marianovella",
    ]
    result = []
    for nichi in nichis:
        if nichi in text:
            df = search_brand(nichi)
            name_list = df["en_name"].values
            if nichi == "s.marianovella":
                for name in name_list:
                    result.append({"brand": "santamarianovella", "name": name})
            elif nichi == "diptyque":
                opt = Namespace(
                    agnostic_nms=False,
                    augment=False,
                    classes=None,
                    conf_thres=0.25,
                    device="",
                    exist_ok=False,
                    hide_conf=False,
                    hide_labels=False,
                    img_size=416,
                    iou_thres=0.45,
                    line_thickness=3,
                    name="exp",
                    nosave=False,
                    project="runs/detect",
                    save_conf=False,
                    save_crop=False,
                    save_txt=False,
                    source=img_dir,
                    update=False,
                    view_img=False,
                    weights=os.path.join(abs_path, "weights/best.pt"),
                )
                result = detect.detect(opt)
            else:
                for name in name_list:
                    if name in text:
                        result.append({"brand": nichi, "name": name})
            if result == []:
                for name in name_list:
                    result.append({"brand": nichi, "name": name})

    return result


def main():
    img_dir = sys.argv[1]
    img = cv2.imread(img_dir)
    height, width, _ = img.shape
    if LIMIT_PX < height or LIMIT_PX < width:
        ratio = float(LIMIT_PX) / max(height, width)
        img = cv2.resize(img,(0,0), fx=ratio, fy=ratio)
        cv2.imwrite(img_dir, img)
        # print('resized')
    text = detect_text(img_dir).lower().split()
    text = "".join(text)
    return json.dumps({"detected": classifier(text, img_dir)})


if __name__ == "__main__":
#    try:
    print(main())
#    except:
#        print(json.dumps({"detected":[]}))

