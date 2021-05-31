import argparse
import time
from pathlib import Path

import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import (
    check_img_size,
    check_requirements,
    check_imshow,
    non_max_suppression,
    apply_classifier,
    scale_coords,
    xyxy2xywh,
    strip_optimizer,
    set_logging,
    increment_path,
    save_one_box,
)
from utils.plots import colors, plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized


def detect(opt):
    source, weights, view_img, save_txt, imgsz = (
        opt.source,
        opt.weights,
        opt.view_img,
        opt.save_txt,
        opt.img_size,
    )
    save_img = not opt.nosave and not source.endswith(".txt")  # save inference images
    webcam = (
        source.isnumeric()
        or source.endswith(".txt")
        or source.lower().startswith(("rtsp://", "rtmp://", "http://", "https://"))
    )
    result = []
    diptyque_dict = {
        "dosonP": "dosoneaudeparfum",
        "dosonT": "dosoneaudetoilette",
        "capitaleP": "eaucapitaleeaudeparfum",
        "lierre": "eaudelierreeaudetoilette",
        "mintheP": "eaudeminthéeaudeparfum",
        "sensT": "eaudessenseaudetoilette",
        "duelleP": "eauduelleeaudeparfum",
        "duelleT": "eauduelleeaudetoilette",
        "lenteT": "eaulenteeaudetoilette",
        "moheliT": "eaumohelieaudetoilette",
        "roseT": "eauroseeaudetoilette",
        "fleurP": "fleurdepeaueaudeparfum",
        "florabellioT": "florabellioeaudetoilette",
        "geraniumT": "geraniumodorataeaudetoilette",
        "lautreT": "l'autreeaudetoilette",
        "neroliT": "l'eaudenérolieaudetoilette",
        "hesperidesT": "l'eaudeshespérides",
        "leauT": "l'eaueaudetoilette",
        "troisT": "l'eautroiseaudetoilette",
        "lombreT": "l'ombredansl'eaueaudetoilette",
        "lombreP": "l’ombredansl’eaueaudeparfum",
        "ofresiaT": "ofrésiaeaudetoilette",
        "oleneT": "oleneeaudetoilette",
        "palaoP": "oudpalaoeaudeparfum",
        "oyedoT": "oyédoeaudetoilette",
        "philosykosP": "philosykoseaudeparfum",
        "philosykosT": "philosykoseaudetoilette",
        "tamdaoP": "tamdaoeaudeparfum",
        "tamdaoT": "tamdaoeaudetoilette",
        "tempoP": "tempoeaudeparfum",
        "vetyverioP": "vetyverioeaudeparfum",
        "vetyverioT": "vetyverioeaudetoilette",
        "volutesP": "voluteseaudeparfum",
        "plurielleT": "eauplurielle",
    }
    # Directories
    save_dir = increment_path(
        Path(opt.project) / opt.name, exist_ok=opt.exist_ok
    )  # increment run
    (save_dir / "labels" if save_txt else save_dir).mkdir(
        parents=True, exist_ok=True
    )  # make dir

    # Initialize
    set_logging()
    device = select_device(opt.device)
    half = device.type != "cpu"  # half precision only supported on CUDA

    # Load model
    model = attempt_load(weights, map_location=device)  # load FP32 model
    stride = int(model.stride.max())  # model stride
    imgsz = check_img_size(imgsz, s=stride)  # check img_size
    names = (
        model.module.names if hasattr(model, "module") else model.names
    )  # get class names
    if half:
        model.half()  # to FP16

    # Second-stage classifier
    classify = False
    if classify:
        modelc = load_classifier(name="resnet101", n=2)  # initialize
        modelc.load_state_dict(
            torch.load("weights/resnet101.pt", map_location=device)["model"]
        ).to(device).eval()

    # Set Dataloader
    vid_path, vid_writer = None, None
    if webcam:
        view_img = check_imshow()
        cudnn.benchmark = True  # set True to speed up constant image size inference
        dataset = LoadStreams(source, img_size=imgsz, stride=stride)
    else:
        dataset = LoadImages(source, img_size=imgsz, stride=stride)

    # Run inference
    if device.type != "cpu":
        model(
            torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters()))
        )  # run once
    t0 = time.time()
    for path, img, im0s, vid_cap in dataset:
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=opt.augment)[0]

        # Apply NMS
        pred = non_max_suppression(
            pred,
            opt.conf_thres,
            opt.iou_thres,
            classes=opt.classes,
            agnostic=opt.agnostic_nms,
        )
        t2 = time_synchronized()

        # Apply Classifier
        if classify:
            pred = apply_classifier(pred, modelc, img, im0s)

        # Process detections
        for i, det in enumerate(pred):  # detections per image
            # print(i)
            if webcam:  # batch_size >= 1
                p, s, im0, frame = path[i], "%g: " % i, im0s[i].copy(), dataset.count
            else:
                p, s, im0, frame = path, "", im0s.copy(), getattr(dataset, "frame", 0)

            p = Path(p)  # to Path
            save_path = str(save_dir / p.name)  # img.jpg
            txt_path = str(save_dir / "labels" / p.stem) + (
                "" if dataset.mode == "image" else f"_{frame}"
            )  # img.txt
            s += "%gx%g " % img.shape[2:]  # #print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            if len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                # #print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    result.append(
                        {"brand": "diptyque", "name": diptyque_dict[names[int(c)]]}
                    )
                    # s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string

                # Write results
                # for *xyxy, conf, cls in reversed(det):
                #     result.append(names[int(cls)])
                # if save_txt:  # Write to file
                #     xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
                #     line = (cls, *xywh, conf) if opt.save_conf else (cls, *xywh)  # label format
                #     with open(txt_path + '.txt', 'a') as f:
                #         f.write(('%g ' * len(line)).rstrip() % line + '\n')

                # if save_img or opt.save_crop or view_img:  # Add bbox to image
                #     c = int(cls)  # integer class
                #     label = None if opt.hide_labels else (names[c] if opt.hide_conf else f'{names[c]} {conf:.2f}')

                #     plot_one_box(xyxy, im0, label=label, color=colors(c, True), line_thickness=opt.line_thickness)
                #     if opt.save_crop:
                #         save_one_box(xyxy, im0s, file=save_dir / 'crops' / names[c] / f'{p.stem}.jpg', BGR=True)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--weights",
        nargs="+",
        type=str,
        default="./weights/best.pt",
        help="model.pt path(s)",
    )
    parser.add_argument(
        "--source", type=str, default="data/images", help="source"
    )  # file/folder, 0 for webcam
    parser.add_argument(
        "--img-size", type=int, default=640, help="inference size (pixels)"
    )
    parser.add_argument(
        "--conf-thres", type=float, default=0.25, help="object confidence threshold"
    )
    parser.add_argument(
        "--iou-thres", type=float, default=0.45, help="IOU threshold for NMS"
    )
    parser.add_argument(
        "--device", default="", help="cuda device, i.e. 0 or 0,1,2,3 or cpu"
    )
    parser.add_argument("--view-img", action="store_true", help="display results")
    parser.add_argument("--save-txt", action="store_true", help="save results to *.txt")
    parser.add_argument(
        "--save-conf", action="store_true", help="save confidences in --save-txt labels"
    )
    parser.add_argument(
        "--save-crop", action="store_true", help="save cropped prediction boxes"
    )
    parser.add_argument(
        "--nosave", action="store_true", help="do not save images/videos"
    )
    parser.add_argument(
        "--classes",
        nargs="+",
        type=int,
        help="filter by class: --class 0, or --class 0 2 3",
    )
    parser.add_argument(
        "--agnostic-nms", action="store_true", help="class-agnostic NMS"
    )
    parser.add_argument("--augment", action="store_true", help="augmented inference")
    parser.add_argument("--update", action="store_true", help="update all models")
    parser.add_argument(
        "--project", default="runs/detect", help="save results to project/name"
    )
    parser.add_argument("--name", default="exp", help="save results to project/name")
    parser.add_argument(
        "--exist-ok",
        action="store_true",
        help="existing project/name ok, do not increment",
    )
    parser.add_argument(
        "--line-thickness", default=3, type=int, help="bounding box thickness (pixels)"
    )
    parser.add_argument(
        "--hide-labels", default=False, action="store_true", help="hide labels"
    )
    parser.add_argument(
        "--hide-conf", default=False, action="store_true", help="hide confidences"
    )
    opt = parser.parse_args()
    # #print(opt)
    check_requirements(exclude=("tensorboard", "pycocotools", "thop"))
    # #print(opt)

    with torch.no_grad():
        if opt.update:  # update all models (to fix SourceChangeWarning)
            for opt.weights in ["yolov5s.pt", "yolov5m.pt", "yolov5l.pt", "yolov5x.pt"]:
                detect(opt=opt)
                strip_optimizer(opt.weights)
        else:
            detect(opt=opt)