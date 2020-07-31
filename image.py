from Adafruit_Thermal import *
from PIL import Image, ImageDraw

image = Image.open("astley.jpg")

printer = Adafruit_Thermal("/dev/serial0", 19200, timeout=5)

printer.printImage(image, True)
printer.feed(3)
