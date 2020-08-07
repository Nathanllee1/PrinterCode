# Printer Chat Printer Code

The [app](https://github.com/Nathanllee1/PrintChatApp)

Utilizes the Python3 port of the original Adafruit [Python-Thermal-Printer](https://github.com/adafruit/Python-Thermal-Printer) library.
Added [this](https://github.com/adafruit/Python-Thermal-Printer/pull/39) to get PIL compatible with python3 and got the image to scale to the size of the reciept paper instead of just cropping everything that didn't fit

## Getting Started

Install Raspbian (I used raspian lite so there would be lower overhead and it would be more stable) and wire the printer according to [this](https://learn.adafruit.com/networked-thermal-printer-using-cups-and-raspberry-pi/connect-and-configure-printer). I powered the printer with the GPIO pins as well.

Run a test to see if the printer is working by punching in these commands into the terminal.

```
stty -F /dev/serial0 19200
echo -e "This is a test.\\n\\n\\n" > /dev/serial0
```

### Installing

Update the system and install prequisities.

```
sudo apt-get update
sudo apt-get install git cups wiringpi build-essential libcups2-dev libcupsimage2-dev python3-serial nodejs python3-pil python3-unidecode npm
```

Install the printer driver. Don't worry about the warnings that g++ gives.

```
git clone https://github.com/adafruit/zj-58
cd zj-58
make
sudo ./install
```

Make the printer the default printer. This is useful if you are going to be doing other things with it.

```
sudo lpadmin -p ZJ-58 -E -v serial:/dev/serial0?baud=19200 -m zjiang/ZJ-58.ppd
sudo lpoptions -d ZJ-58
sudo reboot
```

Clone this repository and try to run some tests

```
git clone https://github.com/Nathanllee1/PrinterCode.git
cd PrinterCode
python3 image.py testPictures/testImage.jpg
python3 printertest.py
```

Install server requirements
```
npm install
```

Copy ```credentials.json.template``` into a file named ```credentials.json``` and fill out your firebase user id
We will have the app automatically fill it in later

Let me know if you have any issues.
