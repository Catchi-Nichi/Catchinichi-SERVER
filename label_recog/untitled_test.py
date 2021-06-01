import untitled0
import cv2
import os


def test_u0():
    base_dir = "../image_test"
    img = os.listdir(base_dir)
    for i in img:
        img_dir = os.path.join(base_dir, i)
        name = untitled0.main(img_dir)
        print(i, name)

        # image = cv2.imread(img_dir)
        # image = cv2.resize(image, dsize=(0, 0), fx=0.3, fy=0.3)
        # cv2.imshow(name, image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()


test_u0()
