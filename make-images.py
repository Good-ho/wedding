"""assets/img-src 원본(JPG)을 리사이즈/WebP 변환해 assets/img에 출력한다. EXIF는 저장하지 않는다.

실행: python tools/make-images.py   (Pillow 필요)
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img-src"
OUT = ROOT / "assets" / "img"

# 갤러리: (출력 이름, 원본 파일, 썸네일 세로 기준점 0=위 1=아래, 가로로 넓은 컷 여부)
# 표시 순서 = 라이트박스 순서. 가로 컷은 그리드에서 2칸을 차지한다(3:2).
GALLERY = [
    ("g01", "p02-aerial-lookup", 0.5, False),
    ("g02", "p05-sofa-closeup", 0.0, False),
    ("g03", "p01-aerial-veil", 0.5, False),
    ("g04", "p10-cafe", 0.5, True),
    ("g05", "p12-studio-icecream", 0.5, False),
    ("g06", "p14-room-bed", 0.5, False),
    ("g07", "p15-gypsophila-couple", 0.3, False),
    ("g08", "p17-curtain-sitting", 0.5, False),
    ("g09", "p09-closeup-bouquet", 0.0, False),
    ("g10", "p20-room-warm", 0.7, False),
    ("g11", "p00-aerial-kiss", 0.5, False),
]
# 폴라로이드(4:5)
PERSON = [
    ("groom", "p07-sofa-groom", 0.5),
    ("bride", "p08-sofa-bride", 0.5),
]

THUMB_W, FULL_W = 480, 1200
WIDE_THUMB = (960, 640)
POLAROID = (720, 900)


def load(name):
    return ImageOps.exif_transpose(Image.open(SRC / f"{name}.jpg")).convert("RGB")


def crop_to(im, ratio, fy):
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio)
        return im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    nh = round(w / ratio)
    top = round((h - nh) * fy)
    return im.crop((0, top, w, top + nh))


def save(im, size, path, q):
    fmt = "JPEG" if path.suffix == ".jpg" else "WEBP"
    im.resize(size, Image.LANCZOS).save(path, fmt, quality=q, method=6 if fmt == "WEBP" else None)
    print(path.name, path.stat().st_size // 1024, "KB")


OUT.mkdir(parents=True, exist_ok=True)
for key, name, fy, wide in GALLERY:
    im = load(name)
    tw, th = WIDE_THUMB if wide else (THUMB_W, THUMB_W * 4 // 3)
    save(crop_to(im, tw / th, fy), (tw, th), OUT / f"{key}-thumb.webp", 78)
    fw = FULL_W
    save(im, (fw, round(im.height * fw / im.width)), OUT / f"{key}-1200.webp", 80)
# 카톡 미리보기(2:1). 카페 컷의 얼굴과 찻잔이 들어가도록 위쪽 기준으로 자른다.
save(crop_to(load("p10-cafe"), 2, 0.07), (800, 400), OUT / "og.jpg", 85)
for key, name, fy in PERSON:
    save(crop_to(load(name), POLAROID[0] / POLAROID[1], fy), POLAROID, OUT / f"{key}.webp", 80)
