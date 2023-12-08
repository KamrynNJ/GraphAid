from flask import Flask, jsonify, request
from PIL import Image
import base64
import re
from quickchart import QuickChart, QuickChartFunction
#from Adafruit_Thermal import *
import PIL
import matplotlib.pyplot as plt
import numpy as np

app = Flask(__name__)
#printer = Adafruit_Thermal("/dev/serial0", 19200, timeout=5)
replacements = {
    'sin' : 'np.sin',
    'cos' : 'np.cos',
    'tan' : 'np.tan',
    'arcsin' : 'np.arcsin',
    'arccos' : 'np.arccos',
    'arctan' : 'np.arctan',
    'csc' : 'np.arcsin',
    'sec' : 'np.arccos',
    'cot' : 'np.arctan',
    'sinh' : 'sinh',
    'cosh' : 'cosh',
    'tanh' : 'tanh',
    'arcsinh' : 'arcsinh',
    'arccosh' : 'arccosh',
    'arctanh' : 'arctanh',
    'csch' : 'arcsinh',
    'sech' : 'arccosh',
    'coth' : 'arctanh',
    'exp': 'np.exp',
    'e': 'np.e',
    'ln': 'np.log',
    'log': 'np.log10',
    'sqrt': 'np.sqrt',
    '^': '**',
    'abs': 'np.absolute',
    'pi': 'np.pi',
    'E': 'e',
    'np.np.log10': 'np.log'
}

allowed_words = [
    'x',
    't',
    'sin',
    'cos',
    'tan',
    'arcsin',
    'arccos',
    'arctan',
    'csc',
    'sec',
    'cot',
    'sinh',
    'cosh',
    'tanh',
    'arcsinh',
    'arccosh',
    'arctanh',
    'csch',
    'sech',
    'coth',
    'sqrt',
    'exp',
    'e',
    'ln',
    'log',
    'abs',
    'pi',
    'E',
]

def string2func(string):
    ''' evaluates the string and returns a function of x '''
    # find all words and check if all are allowed:
    for word in re.findall('[a-zA-Z_]+', string):
        if word not in allowed_words:
            raise ValueError(
                '"{}" is forbidden to use in math expression'.format(word)
            )

    for [old, new] in replacements.items():
        string = string.replace(old, new)
        print(string)

    def func(x):
       print(eval(string))
       return eval(string)

    return func

def graphFunctionX(text_input, min, max):
    func = string2func(text_input)
    fig = plt.figure()
    x = np.linspace(min,max,250)
    y = func(x)
    plt.plot(x, y,label=text_input)
    plt.legend()
    plt.grid()
    return fig

def graphLine(text_input, min, max):
    func = string2func(text_input)
    fig = plt.figure()
    plt.hlines(y = text_input, xmin = min, xmax = max)
    plt.legend()
    plt.grid()
    plt.show()
    return fig

def pictureGraph(graph):
    fig = graph
    saved = plt.savefig('../../public/graph.png')
    image = Image.open('../../public/graph.png')
    file_out = '../../public/graph.bmp'
    bmpImage = Image.open('../../public/graph.bmp')
    new_image = image.save(file_out)
    w, h = image.size
    box = (20, 50, w-45, h-15)
    img2 = image.crop(box)
    img2.save('../../public/crop.png')
    image2 = Image.open('../../public/crop.png')
    newsize = (492,369)
    img2 = image2.resize(newsize)

    w1,h1 = image2.size
    print(w)
    print(h)
    print(w1)
    print(h1)

    #printer.printImage(img2.rotate(90, PIL.Image.NEAREST, expand = 1), True)
    #printer.feed(3)
    print("Done")

@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello, World"})

@app.route('/api/sendImg', methods=['POST'])
def process():
    x = request.json.get('data')
    y = request.json.get('y')
    eq = request.json.get('eq')
    min = request.json.get('min')
    max = request.json.get('max')
    print(min)
    pictureGraph(graphFunctionX(eq,min,max) if "x" in eq else graphLine(eq,min,max))
    return jsonify({"message": x})

if __name__ == '__main__':
    app.run(port=5328)
