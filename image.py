
from Adafruit_Thermal import *
import sys

printer = Adafruit_Thermal("/dev/serial0", 19200, timeout=5)

if printer.hasPaper():
    printer.printImage(str(sys.argv[1]), False)
    printer.feed(3)
    print('Printed')
else:
    print('No Paper')