from Adafruit_Thermal import *
import sys

printer = Adafruit_Thermal("/dev/serial0", 19200, timeout=5)
printer.printImage(str(sys.argv[1]), True)
printer.feed(3)
