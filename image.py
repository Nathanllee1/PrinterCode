
from Adafruit_Thermal import *
import sys

printer = Adafruit_Thermal("/dev/serial0", 19200, timeout=5)

if printer.hasPaper():
    printer.printImage(str(sys.argv[1]), True)
    printer.feed(3)
else:
    print('No Paper')